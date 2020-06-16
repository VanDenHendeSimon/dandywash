from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    @staticmethod
    def start_washing(programma_id, mand_id, tijdstip):
        sql = """
        INSERT INTO washistoriek(ProgrammaId, MandId, Tijdstip) VALUES (%s, %s, %s)
        """

        params = [programma_id, mand_id, tijdstip]
        return Database.execute_sql(sql, params)

    @staticmethod
    def get_was_historiek_details():
        # Skip duurtijd, is timedelta en niet JSON serializable (=> Eventueel converten naar string)
        sql = """
        SELECT
            *
        FROM vwwashistoriekdetails
        LIMIT 100;
        """

        return Database.get_rows(sql)

    @staticmethod
    def get_historiek_details():
        sql = """
        SELECT
            *
        FROM vwhistoriekdetails
        LIMIT 100;
        """

        return Database.get_rows(sql)

    @staticmethod
    def get_was_per_mand_per_dag_bleek():
        sql = """
        select max(Waarde) as 'Hoeveelheid', date(Tijdstip) as 'Dag'
        from historiek
        where ComponentId = (select Id from component where Beschrijving = 'afstandssensor bleek')
        group by date(Tijdstip)
        ;
        """

        return Database.get_rows(sql)

    @staticmethod
    def get_was_per_mand_per_dag_donker():
        sql = """
        select max(Waarde) as 'Hoeveelheid', date(Tijdstip) as 'Dag'
        from historiek
        where ComponentId = (select Id from component where Beschrijving = 'afstandssensor donker')
        group by date(Tijdstip)
        ;
        """

        return Database.get_rows(sql)

    @staticmethod
    def get_was_historiek_grafiek():
        sql = "SELECT * FROM vwwashistoriekgrafiek;"
        return Database.get_rows(sql)

    @staticmethod
    def get_hoeveel_keer_programma():
        sql = """
        select
            p.Naam as 'Programma',
            ifnull(count(w.ProgrammaId), 0)  as 'Aantal'
        from programma as p
            left join washistoriek as w on w.ProgrammaId = p.Id
        where verwijderd != 1
        group by p.Naam
        order by p.Naam
        ;
        """
        return Database.get_rows(sql)

    @staticmethod
    def get_baskets_percentage_filled():
        # Percentage, volume kan ook maar is hier niet nodig
        sql = "SELECT * FROM vwcurrentpercentage;"
        return Database.get_one_row(sql)

    @staticmethod
    def get_currently_washing():
        sql = "SELECT * FROM vwcurrentlywashing;"
        return Database.get_one_row(sql)

    @staticmethod
    def get_currently_planned_washing():
        sql = "SELECT * FROM vwcurrentlywashing WHERE Begonnen = 0;"
        return Database.get_one_row(sql)

    @staticmethod
    def get_was(volgnummer):
        sql = "SELECT * FROM washistoriek WHERE Volgnummer = %s"
        return Database.get_one_row(sql, [volgnummer])

    @staticmethod
    def commence_washing(volgnummer):
        sql = "UPDATE washistoriek SET Begonnen = 1 WHERE Volgnummer = %s"
        return Database.execute_sql(sql, [volgnummer])

    @staticmethod
    def get_baskets_volume():
        # Volume in Liter
        sql = "SELECT * FROM vwcurrentvolume;"
        return Database.get_one_row(sql)

    @staticmethod
    def get_programmas():
        sql = """
        select
            p.Naam,
            p.Duurtijd,
            p.HoeveelheidProduct,
            p.Id,
            p.Temperatuur,
            ifnull(count(w.ProgrammaId), 0)  as 'Aantal'
        from programma as p
            left join washistoriek as w on w.ProgrammaId = p.Id
        where verwijderd != 1
        group by p.Naam
        order by ifnull(count(w.ProgrammaId), 0) DESC
        ;
        """
        # sql = "SELECT * FROM programma WHERE Verwijderd != 1;"
        return Database.get_rows(sql)

    @staticmethod
    def get_programma(_id):
        sql = "SELECT * FROM programma WHERE Id = %s;"
        return Database.get_one_row(sql, [_id])

    @staticmethod
    def edit_programma(_id, duurtijd, temperatuur, hoevelheid_product, naam):
        sql = "UPDATE programma SET duurtijd = %s, temperatuur = %s, hoeveelheidProduct = %s, naam = %s WHERE Id = %s;"
        return Database.execute_sql(sql, [duurtijd, temperatuur, hoevelheid_product, naam, _id])

    @staticmethod
    def create_programma(duurtijd, temperatuur, hoevelheid_product, naam):
        sql = "INSERT INTO programma (Duurtijd, Temperatuur, HoeveelheidProduct, Naam) VALUES (%s, %s, %s, %s);"
        return Database.execute_sql(sql, [duurtijd, temperatuur, hoevelheid_product, naam])

    @staticmethod
    def get_notificaties():
        sql = "SELECT * FROM vwnotificaties WHERE Verwijderd != 1;"
        return Database.get_rows(sql)

    @staticmethod
    def get_new_notificaties():
        sql = "SELECT * FROM vwnotificaties WHERE Gezien = 0 AND Verwijderd != 1;"
        return Database.get_rows(sql)

    @staticmethod
    def create_notificatie(niveau, bericht):
        sql = "insert into notificatie(`Niveau`, `Bericht`) values (%s, %s);"
        params = [niveau, bericht]
        return Database.execute_sql(sql, params)

    @staticmethod
    def get_data_for_new_connection():
        return {
            'notifications': DataRepository.get_new_notificaties(),
            'percentageFilled': DataRepository.get_baskets_percentage_filled(),
            'currentlyWashing': DataRepository.get_currently_washing()
        }

    @staticmethod
    def store_historiek(value, _id):
        sql = """
        insert into historiek (ComponentId, Waarde) values(%s, %s);
        """

        params = [_id, value]
        return Database.execute_sql(sql, params)

    @staticmethod
    def mark_notifications_seen():
        sql = "UPDATE notificatie set Gezien = 1 where Tijdstip < CURRENT_TIMESTAMP();"
        return Database.execute_sql(sql)

    @staticmethod
    def delete_notification(volgnummer):
        sql = "UPDATE notificatie SET verwijderd = 1 WHERE Volgnummer = %s;"
        return Database.execute_sql(sql, params=[volgnummer])

    @staticmethod
    def delete_programma(volgnummer):
        sql = "UPDATE programma SET verwijderd = 1 WHERE id = %s;"
        return Database.execute_sql(sql, params=[volgnummer])

    @staticmethod
    def cancel_was(volgnummer):
        sql = "UPDATE washistoriek SET Geannuleerd = 1 WHERE Volgnummer = %s;"
        return Database.execute_sql(sql, params=[volgnummer])
