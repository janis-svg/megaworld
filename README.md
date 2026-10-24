# MegaWorld

Zombiju izdzīvošanas spēle pārlūkā. Strādā telefonā un datorā.

**Spēlēt:** https://janis-svg.github.io/megaworld/

## Kā spēlēt

- Diena ilgst 5 minūtes, nakts 5 minūtes. Pulkstenis ir augšā.
- Dienā zombiju nav. Meklē ieročus, lodes, bruņas un klucīšus mājās, atvilknēs un plauktos.
- Cilvēkus vari aicināt komandā (līdz 9). Vājāki paši atnāk un piedāvā pievienoties.
- No 22:00 nāk zombiji, skeleti un vilkači. 3 zombiji + 2 vilkači var saplūst zombvilkā.
- Rītā zombiji sprāgst, turies pa gabalu.

**Telefons:** kloķis kustībai, lielā poga šauj, 🔄 maina ieroci, 🔨 būvē, 🤚 atver un aicina, ⬆ lec.
**Dators:** WASD, pele, F vai klikšķis šauj, 1-5 ieroči, B būvē, E rīcība, T komanda.

## Kur kas atrodas

| Fails | Kas tur ir |
|---|---|
| `index.html` | Lapas uzbūve (pogas, paneļi) |
| `style.css` | Izskats (krāsas, pogu vietas) |
| `js/01_sakums.js` | Galvenie mainīgie |
| `js/02_teksti.js` | Visi teksti latviski un angliski |
| `js/03_pamati.js` | Aina, gaisma, spēlētāja modelis |
| `js/04_ieroci_sadursmes.js` | Ieroči un to stiprums, sadursmes ar sienām |
| `js/05_pasaule.js` | Koki, būdiņas, priekšmetu izskats, debesis |
| `js/06_laiks.js` | Diennakts un pulkstenis |
| `js/07_pilseta.js` | Mājas, mašīnas, mežs, pilsētas uzbūve |
| `js/08_prieksmeti_lodes.js` | Priekšmetu pacelšana, lodes, raķetes |
| `js/09_skanas_efekti.js` | Skaņas, sprādzieni, dzīvības joslas |
| `js/10_buvesana.js` | Kluči un durvis |
| `js/11_ui.js` | Inventārs, ieroču josla, rīcības poga |
| `js/12_cilveki.js` | Citi cilvēki, bandas, kari, nocietinājumi |
| `js/13_monstri.js` | Zombiji, skeleti, vilkači, zombvilki |
| `js/14_spele.js` | Šaušana, kustība, galvenais spēles cikls |
| `js/15_vadiba.js` | Telefona pogas un kloķis |

Faili tiek ielādēti pēc kārtas (01, 02, 03...). Nemaini to kārtību `index.html`.

## Kā mainīt spēli ar AI

Viss kods ir par garu, lai to iedotu AI vienā reizē. Dari tā:

1. Atrodi tabulā, kurā failā ir tas, ko gribi mainīt.
2. Iedod AI **tikai to vienu failu** un uzraksti, ko gribi.
3. Palūdz: *"Atdod visu šo failu ar izmaiņām. Nemaini funkciju nosaukumus, jo tās izmanto citi faili."*
4. Ieliec jauno failu vietā un pārbaudi spēli.

Ja kaut kas salūzt, GitHub atceras katru iepriekšējo versiju, tāpēc vienmēr var atgriezties atpakaļ.

## Testēšanai

Pievieno saitei `?debug`, un pārlūka konsolē būs komandas, piemēram `MW.setHour(22)` (uzreiz nakts) vai `MW.give('rpg')` (iedod prettanku ieroci).
