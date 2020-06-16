# Projectgegevens
**Voornaam Naam:**  Simon Van Den Hende

**Sparringpartner:** Alexander Everaert

**Projectsamenvatting in max 10 woorden:** Automatisering van het banale en ouderwetse kleren wassen

**Projecttitel:** Dandywash


# Tips voor feedbackgesprekken
## Voorbereiding

>Bepaal voor jezelf waar je graag feedback op wil. Schrijf op voorhand een aantal punten op waar je zeker feedback over wil krijgen. Op die manier zal het feedbackgesprek gerichter verlopen en zullen vragen, die je zeker beantwoord wil hebben, aan bod komen.

## Tijdens het gesprek:
>**Luister actief:** Schiet niet onmiddellijk in de verdediging maar probeer goed te luisteren. Laat verbaal en non-verbaal ook zien dat je aandacht hebt voor de feedback door een open houding (oogcontact, rechte houding), door het maken van aantekeningen, knikken...

>**Maak notities:** Schrijf de feedback op zo heb je ze nog nadien. Noteer de kernwoorden en zoek naar een snelle noteer methode voor jezelf. Als je goed noteert,kan je op het einde van het gesprek je belangrijkste feedback punten kort overlopen.

>**Vat samen:** Wacht niet op een samenvatting door de docenten, dit is jouw taak: Check of je de boodschap goed hebt begrepen door actief te luisteren en samen te vatten in je eigen woorden.

>**Sta open voor de feedback:** Wacht niet op een samenvatting door de docenten, dit is jouw taak: Check of je de boodschap goed hebt begrepen door actief te luisteren en samen te vatten in je eigen woorden.`

>**Denk erover na:** Denk na over wat je met de feedback gaat doen en koppel terug. Vind je de opmerkingen terecht of onterecht? Herken je je in de feedback? Op welke manier ga je dit aanpakken?

## NA HET GESPREK

> Herlees je notities en maak actiepunten. Maak keuzes uit alle feedback die je kreeg: Waar kan je mee aan de slag en wat laat je even rusten. Wat waren de prioriteiten? Neem de opdrachtfiche er nog eens bij om je focuspunten te bepalen.Noteer je actiepunten op de feedbackfiche.

# Feedforward gesprekken

## Gesprek 1 (Datum: 11/03/2020)
Lectoren: Dieter Roobrouck, Johan Vannieuwenhuyse

### Vragen voor dit gesprek:
- [x] vraag 1:  Ik had elk aspect van het project vrij goed voorbereid en geresearcht.  
                Over de electronica had ik het meest onzekerheden, maar die vragen stel ik liever aan Geert.  
                Ik had mijn idee volledig voorbereid in een virtuele omgeving.  
                Hierdoor had ik al een duidelijk beeld over het project.  
                Elke vraag die tijdens dit proces opkwam zocht ik op online en werd op die manier opgelost.  
                Ik keek vooral uit naar wat de docenten vonden van mijn idee en de uitwerking ervan.  

- [x] vraag 2:  Zou u zaken anders aanpakken of anders organiseren?

### Dit is de feedback op mijn vragen. 
- feedback 1:   Beide lectoren vonden het een goed, creatief en uniek idee.  
                Dit gaf mij een zeer goed gevoel.  
                Ze waren ook onder de indruk van de visualisaties, waardoor er voor hen ook weinig vragen overschoten.  

- feedback 2:   Dieter stelde voor om het flesje met wasproduct om te draaien.  
                Zo kon ik de zwaartekracht gebruiken en minder vertrouwen op de pomp.  

### Hier komt de feedforward: wat ga ik concreet doen?
- [x] ToDo 1:   Ik ga voornamelijk verder doen zoals ik bezig was.  
                De feedback duidde niet op een andere aanpak.  
                Er worden geen concrete wijzigingen verwacht.  
                Ik ga dus gewoon verder blijven werken met dezelfde inzet.  

- [x] ToDo 2:   Ik overwoog om het flesje te verplaatsen, maar aangezien de vloeistof  
                bovenaan de trommel moet binnenkomen, zou het flesje al aan de wasmand bevestigd moeten worden.  
                Ik bekeek de mogelijkheden in de 3D omgeving en vond geen enkele plaats die even gebruiksvriendelijk is.  
                Ik vraag nog eens de mening van mijn sparring partner.  

## Gesprek 2 (Datum: 27/05/2020)
Lector: Geert Desloovere

### Vragen voor dit gesprek:
- [x] vraag 1: Mijn i2c bus wordt meestal niet gedetecteerd door het i2cdetect -y 1 commando op de Pi. Wanneer ik de voeding van mijn Pi neem ipv een externe power supply, wordt de i2c bus wel consistent gedetecteerd. Ik vroeg me af welke concrete gevolgen een rechtstreekse connectie op de 5v voeding van de Pi teweeg kan brengen.
- [ ] vraag 2: Voor het detecteren van een nieuw kledingsstuk in de process-bak gebruik een passieve infrarood bewegingssensor. Ik las online dat deze 60 seconden nodig heeft om zich te acclimatiseren, en na elke trigger nog maals 6-7 seconden voor terug klaar te zijn voor een nieuwe detectie. Hoe los/vang ik dit best op?

### Dit is de feedback op mijn vragen. 
- feedback 1: Concreet is de Pi zeer kwetsbaar voor kortsluitingen op zijn voedingspinnen, en indien dit gebeurd, is er een zeer grote kans dat de Pi direct kapot is. Aangezien mijn probleem aan mijn externe voeding lag, stelde Geert voor om de 5v pin van de Arduino te gebruiken. Dit ga ik doen als tijdelijke oplossing, terwijl ik wacht op een nieuw extern voedingsbordje dat ik net na het gesprek bestelde.
- feedback 2: Voor het detecteren van kledij is de passieve infrarood sensor helemaal niet geschikt. Deze werkt op warmte, en aangezien de kleren dezelfde temperatuur hebben als de omgeving, zullen deze nooit gedetecteerd worden. Dit was een link die ik niet direct legde, en die er bij de FA01 bespreking door geglipt was. Deze sensor kan dus niet gebruikt worden in mijn Project. Geert stelde voor om een 3e ultra-sonische afstandssensor te gebruiken, en deze een verschil in afstand te laten detecteren. 

### Hier komt de feedforward: wat ga ik concreet doen?
- [x] ToDo 1: Nieuwe externe voeding bestellen / 5v pin vd Pi vermeiden.
- [x] ToDo 2: Nieuwe ultra-sonische afstandssensor bestellen, en de passieve infrarood sensor schrappen.

## Gesprek 3 (Datum: 05/06/2020)
Lector: Claudia

### Vragen voor dit gesprek:
- [x] vraag 1: Tables zijn niet mobile friendly, hoe kan ik dit oplossen? De catch is dat het gegenereerd wordt, dus ik de headers niet op voorhand ken => moet dus met JavaScript gebeuren
- [x] vraag 2: Aglemene feedback

### Dit is de feedback op mijn vragen. 
- feedback 1: De tables met de pure historiek is niet nuttig voor de doorsnee gebruiker. Tonen van deze raw data is dus overbodig. Vooral focussen op grafieken van nuttige data
- feedback 2: Het design leek wat ouderwets. Dit kan rap opgelost worden aangezien er maar 2 css rules moeten veranderd worden. Daarnaast heeft Claudia ook aangeraden om iets van verschil te steken in de donkere vs de bleke wasmand. De programma's worden best gesorteerd op vaakst gebruikt, duidelijke titels / tekst in het algemeen (begrijpbaar voor de doorsnee gebruiker), betere horizontale spacing bij de programma selectie, duidelijkere indicatie dat je moet klikken bij de programmakeuze. Het kwam erop neer dat ik hier best 2 aparte pagina's maak. icons minder dikke randen geven => algemene stijl van het design beter volgen.

### Hier komt de feedforward: wat ga ik concreet doen?
- [x] ToDo 1: Tables met raw data weglaten, meer focussen op grafieken
- [x] ToDo 2: Algemene look aanpassen door header en background te moderniseren. Kijken hoe ik de wasmand afbeeldingen kan styleren voor beide manden. Programma en Programma Keuze opsplitsen in 2 verschillende pagina's. De javascript code kan grotendeels gelijk blijven, ik ga voor beide pagina's dezelfde js file gebruiken. Icons namaken met dunnere edges.

## Gesprek 4 (Datum: dd/mm/yyyy)
Lector: 

### Vragen voor dit gesprek:
- [x] vraag 1:
- [ ] vraag 2: 

### Dit is de feedback op mijn vragen. 
- feedback 1:
- feedback 2:

### Hier komt de feedforward: wat ga ik concreet doen?
- [x] ToDo 1:
- [x] ToDo 2:
