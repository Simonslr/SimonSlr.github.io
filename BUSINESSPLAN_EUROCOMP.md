# EUROCOMP — Business Plan Complet
### Version 1.0 — Juin 2026
### Projet fondateur — Premier projet entrepreneurial

---

## TABLE DES MATIÈRES

1. [Résumé Exécutif](#1-résumé-exécutif)
2. [Description du Projet](#2-description-du-projet)
3. [Analyse de Marché](#3-analyse-de-marché)
4. [Modèle Économique](#4-modèle-économique)
5. [Analyse Concurrentielle](#5-analyse-concurrentielle)
6. [Plan Financier Complet](#6-plan-financier-complet)
7. [Stratégie Marketing & Acquisition](#7-stratégie-marketing--acquisition)
8. [Aspects Légaux & Réglementaires](#8-aspects-légaux--réglementaires)
9. [Analyse des Risques](#9-analyse-des-risques)
10. [Feuille de Route (18 mois)](#10-feuille-de-route-18-mois)
11. [Conclusion & Vision Long Terme](#11-conclusion--vision-long-terme)

---

## 1. RÉSUMÉ EXÉCUTIF

**Nom du projet :** EuroComp (eurocompare.fr)
**Porteur :** Fondateur unique — micro-entreprise
**Secteur :** E-commerce / Comparaison de prix / Affiliation
**Stade actuel :** MVP développé, déployé sur Vercel
**Investissement initial :** ~0 € (développement personnel)

### Le concept en une phrase
EuroComp compare automatiquement les prix du même produit sur les 5 principaux Amazon européens (FR, DE, ES, IT, NL) et indique au consommateur français où acheter moins cher, livraison incluse.

### Le problème résolu
Un consommateur français qui achète un Sony WH-1000XM5 sur Amazon.fr à 279 € ignore qu'il pourrait le payer 231,50 € sur Amazon.de — soit **47,50 € d'économie** sur un seul achat. Cette asymétrie d'information touche des millions d'acheteurs en ligne chaque jour.

### Pourquoi maintenant
- L'achat transfrontalier au sein de l'UE est légal, sans droits de douane
- Amazon livre dans toute l'Europe (souvent gratuitement avec Prime)
- Aucun outil simple et visuel n'existe pour comparer les prix entre Amazon nationaux
- La conscience du pouvoir d'achat est au plus haut en France post-inflation 2022-2025

### Potentiel financier (conservateur)
- Break-even opérationnel : **~4 ventes référencées/mois**
- Objectif 12 mois : 50-100 ventes/mois → 170-340 € net/mois
- Objectif 24 mois : 200-500 ventes/mois → 700-1 750 € net/mois
- Plafond micro-entreprise : 77 700 €/an (non menacé avant plusieurs années)

---

## 2. DESCRIPTION DU PROJET

### 2.1 Le produit

EuroComp est un site web qui :
1. **Affiche des fiches produits** avec les prix en temps réel sur chaque Amazon européen
2. **Calcule automatiquement l'économie réelle** (prix produit + frais de livraison vers la France)
3. **Redirige via un lien affilié** directement vers la page produit sur le meilleur Amazon
4. **Présente une interface premium** : animations fluides, comparaisons visuelles, expérience mobile-first

### 2.2 Proposition de valeur unique

| Ce que les autres font | Ce que EuroComp fait |
|---|---|
| Comparer Amazon.fr vs Fnac vs Darty | Comparer Amazon.fr vs Amazon.de vs Amazon.es... |
| Ne pas inclure la livraison | Afficher le prix livraison incluse vers la France |
| Interface datée (tableau brut) | Interface premium, animations, expérience moderne |
| Se concentrer sur les "gros" (TV, frigo) | Accessible sur tous types de produits |

### 2.3 Technologies utilisées

- **Frontend :** Next.js 16 (React 19), TypeScript — ultra-performant, SEO-natif
- **Styling :** Tailwind CSS 4, GSAP (animations), Lenis (scroll premium)
- **Infrastructure :** Vercel (CDN mondial, déploiement automatique)
- **Data :** Amazon Product Advertising API (PA-API) — officielle, gratuite sous conditions
- **Analytics :** Vercel Analytics

### 2.4 État actuel du projet

✅ Site développé et déployé (eurocomp.vercel.app)
✅ Interface premium avec animations avancées
✅ Pages légales (mentions légales, confidentialité, cookies)
✅ Bannière RGPD
✅ Google Search Console configuré
✅ SEO structuré (JSON-LD, métadonnées, sitemap)
⏳ Intégration Amazon PA-API (en cours)
⏳ Données produits réelles (en attente API)
⏳ Nom de domaine .com/.fr à acheter

---

## 3. ANALYSE DE MARCHÉ

### 3.1 Taille du marché

**E-commerce en France (2025) :**
- CA total : ~150 milliards d'euros
- Part Amazon France : ~30 milliards d'euros
- Croissance annuelle : +8-10 %

**Marché de la comparaison de prix :**
- Google Shopping génère des milliards de clics/an
- Idealo (Allemagne) : 50+ millions de visiteurs/mois en Europe
- LeGuide.com (France) : 5+ millions de visiteurs/mois
- Kelkoo : présent dans 20 pays européens

**Marché adressable spécifique (comparaison inter-Amazon) :**
Aucun acteur dominant n'existe sur ce créneau précis. C'est la fenêtre d'opportunité d'EuroComp.

### 3.2 Le consommateur cible

**Persona principal — "Lucas, 28 ans"**
- Acheteur régulier sur Amazon (2-4 fois/mois)
- Attentif au rapport qualité/prix
- À l'aise avec le numérique
- Connaît l'existence des Amazon étrangers mais trouve ça "compliqué"
- Motivation principale : économiser sur un achat qu'il ferait de toute façon

**Persona secondaire — "Marie, 42 ans"**
- Mère de famille, achète régulièrement de l'électronique pour la maison
- Cherche les bons plans avant chaque achat important
- Passe par Google pour comparer avant d'acheter
- Sensible aux économies sur les produits à +100 €

**Persona tertiaire — "Tech Enthousiaste"**
- Acheteur compulsif de gadgets, casques, claviers mécaniques
- Suit des chaînes YouTube/TikTok tech
- Partage naturellement les bons plans sur Reddit, Discord

### 3.3 Tendances favorables

1. **Inflation 2022-2025 :** Les Français cherchent à économiser comme jamais
2. **Montée des achats transfrontaliers :** +15 % par an en UE selon la Commission Européenne
3. **Mobile-first :** 65 % des achats Amazon initiés depuis un mobile — EuroComp est mobile-first
4. **Contenu court-format (TikTok, Reels) :** "J'ai économisé 47 € sur mon casque" = viralité naturelle
5. **Méfiance envers Amazon.fr :** Scandales vendeurs tiers, prix variables — les gens cherchent des alternatives

### 3.4 Barrières à l'entrée (avantages compétitifs d'EuroComp)

- **Complexité technique :** Gérer 5 API Amazon, la logistique de livraison par pays, le SEO multilingue n'est pas trivial
- **Expérience utilisateur :** Une interface médiocre = abandon. EuroComp a une UX premium.
- **First-mover :** Sur ce créneau précis, être là en premier compte énormément pour le SEO
- **Confiance utilisateur :** Mentions légales, RGPD, transparence affiliation = crédibilité

---

## 4. MODÈLE ÉCONOMIQUE

### 4.1 Source de revenus principale : Affiliation Amazon Associates

**Comment ça fonctionne :**
1. L'utilisateur clique sur "Acheter sur Amazon.de" depuis EuroComp
2. Il est redirigé vers Amazon.de avec le tag affilié EuroComp
3. S'il achète dans les **24 heures** (cookie Amazon), EuroComp touche une commission

**Taux de commission par catégorie (Amazon Europe) :**

| Catégorie | Taux | Exemple produit 200 € | Commission |
|---|---|---|---|
| Électronique grand public | 2,5 % | Casque Bluetooth | 5,00 € |
| Informatique | 2,5 % | Clavier mécanique | 5,00 € |
| Photo/Vidéo | 3,0 % | Appareil photo | 6,00 € |
| Jeux vidéo | 2,0 % | Manette | 4,00 € |
| Maison/Cuisine | 4,5 % | Robot cuisine | 9,00 € |
| Mode | 10,0 % | Vêtements | 20,00 € |
| **Moyenne pondérée** | **~3 %** | **200 €** | **~6 €** |

**Programmes à rejoindre :**
- Amazon Associates FR (obligatoire)
- Amazon Associates DE (marché le plus rentable — prix souvent les plus bas)
- Amazon Associates ES
- Amazon Associates IT
- Amazon Associates NL
- **Amazon OneLink :** consolide les conversions cross-pays (à activer)

### 4.2 Conditions d'accès à l'API (point critique)

Amazon PA-API est **gratuite** mais impose :
- Être membre du programme Amazon Associates
- Réaliser **3 ventes qualifiantes dans les 180 jours** suivant l'inscription
- Sans ça : compte fermé, accès API révoqué

**Plan d'action pour les 3 premières ventes :**
- Demander à 3 proches d'acheter via les liens (stratégie de bootstrap)
- Créer du contenu sur 3 produits très demandés (SEO court terme)
- TikTok/Reels : un post viral peut générer des dizaines de ventes en 24h

### 4.3 Sources de revenus secondaires (futures, an 2+)

| Source | Potentiel mensuel | Complexité |
|---|---|---|
| Google AdSense (display) | 20-100 € pour 10k visites | Faible |
| Partenariats marques | 100-500 €/article sponsorisé | Moyenne |
| Alertes prix (freemium) | 5-10 €/mois × abonnés | Élevée |
| API EuroComp (B2B) | 50-200 €/mois × clients | Très élevée |

**Recommandation :** Se concentrer à 100 % sur l'affiliation Amazon les 18 premiers mois. Ne pas disperser les efforts.

---

## 5. ANALYSE CONCURRENTIELLE

### 5.1 Concurrents directs

| Concurrent | Forces | Faiblesses | Menace |
|---|---|---|---|
| **Idealo.fr** | Notoriété, SEO établi, milliers de marchands | Ne compare pas entre Amazon nationaux, UX datée | Moyenne |
| **LeGuide.com** | SEO fort France | Vieux, peu innovant, pas de focus Amazon inter-national | Faible |
| **Camelcamelcamel** | Historique de prix Amazon (1 pays) | 1 seul pays, UX terrible, non-mobile | Très faible |
| **Keepa** | Données riches, historique | Outil pro, pas grand public, payant | Faible |
| **Prix Malin / Dealabs** | Communauté active | Deals manuels, pas de comparaison systématique | Faible |

### 5.2 Positionnement d'EuroComp

```
         UX Premium
              ↑
              |
    EuroComp  |
              |
Peu de pays←─┼─────→ Beaucoup de pays
              |
      Idealo  |  Camelcamelcamel
              |
              ↓
         UX Basique
```

EuroComp occupe un espace non exploité : **UX premium + focus Amazon Europe + simplicité**.

### 5.3 Avantage défendable dans le temps

- **SEO :** Chaque fiche produit indexée est un actif permanent. 100 fiches = 100 portes d'entrée Google.
- **Données :** Historique de prix constitué au fil du temps → fonctionnalités impossibles à copier rapidement
- **Communauté :** Si EuroComp devient "le site des bons plans Amazon Europe", l'effet de réseau est puissant
- **Marque :** Une marque connue dans un niche = barrière psychologique pour les concurrents

---

## 6. PLAN FINANCIER COMPLET

### 6.1 Structure des charges

#### Charges fixes mensuelles

| Poste | An 1 | An 2+ | Note |
|---|---|---|---|
| Vercel Pro | 18 € | 18 € | Obligatoire en commercial |
| Nom de domaine (.fr ou .com) | 1,25 € | 1,25 € | ~15 €/an |
| Amazon PA-API | 0 € | 0 € | Gratuit (sous conditions) |
| **TOTAL FIXE** | **19,25 €** | **19,25 €** | |

#### Charges fiscales et sociales (micro-entreprise)

| Charge | Taux | Base | Déclenchement |
|---|---|---|---|
| URSSAF (cotisations sociales) | 22 % | Chaque euro encaissé | Dès le 1er euro |
| Versement libératoire IR (BIC) | 1,7 % | Chaque euro encaissé | Sur option |
| CFE (taxe communale) | ~300 €/an | Fixe | An 2, si CA > 5 000 €/an |
| TVA | 0 % | — | Franchise jusqu'à 36 800 €/an |

**Taux de prélèvement total :** 23,7 % du CA encaissé

#### Charges optionnelles (à considérer)

| Poste | Coût | Quand l'envisager |
|---|---|---|
| Keepa API (données prix historiques) | 19 €/mois | Si PA-API insuffisante |
| Outil SEO (Semrush / Ahrefs) | 0-119 €/mois | À partir de 6 mois |
| Comptable | 0-50 €/mois | Optionnel en micro-entreprise |
| Publicité Meta/TikTok Ads | Variable | Si budget disponible (non essentiel) |

### 6.2 Hypothèses de revenus

**Commission moyenne retenue : 5 € par vente**
(base conservatrice : 2,5 % sur produit moyen 200 €)

**Taux de conversion appliqués :**
- Trafic organique → clic affilié : 12 %
- Clic affilié → achat : 6 %
- Taux global visiteur → vente : **~0,7 %**

### 6.3 Simulations financières annuelles

#### SCÉNARIO A — Pessimiste (croissance lente)

| Mois | Visiteurs/mois | Ventes/mois | CA/mois | Net/mois |
|---|---|---|---|---|
| M1-M3 | 50-150 | 0-1 | 0-5 € | **-19 €** |
| M4-M6 | 150-400 | 1-3 | 5-15 € | **-15 à -4 €** |
| M7-M9 | 400-800 | 3-6 | 15-30 € | **-4 à +5 €** |
| M10-M12 | 800-1 500 | 6-10 | 30-50 € | **+5 à +19 €** |
| **Total An 1** | | ~60 ventes | **~300 €** | **~-100 €** |

Revenu net annuel an 1 : **-100 € à +100 €** (période d'investissement)

#### SCÉNARIO B — Réaliste (progression organique normale)

| Mois | Visiteurs/mois | Ventes/mois | CA/mois | Net/mois |
|---|---|---|---|---|
| M1-M3 | 100-300 | 1-3 | 5-15 € | **-14 à -4 €** |
| M4-M6 | 300-700 | 3-8 | 15-40 € | **-4 à +12 €** |
| M7-M9 | 700-1 500 | 8-15 | 40-75 € | **+12 à +38 €** |
| M10-M12 | 1 500-3 000 | 15-30 | 75-150 € | **+38 à +96 €** |
| **Total An 1** | | ~150 ventes | **~750 €** | **~+350 €** |

| Année | Ventes/mois (moy.) | CA annuel | Net annuel |
|---|---|---|---|
| An 1 | ~12/mois | ~750 € | **~+350 €** |
| An 2 | ~50/mois | ~3 000 € | **~+1 800 €** |
| An 3 | ~150/mois | ~9 000 € | **~+6 000 €** |

#### SCÉNARIO C — Optimiste (viral / bonne exécution marketing)

| Période | Visiteurs/mois | Ventes/mois | CA/mois | Net/mois |
|---|---|---|---|---|
| M1-M3 | 200-600 | 2-5 | 10-25 € | Légèrement négatif |
| M4-M6 | 600-2 000 | 5-15 | 25-75 € | **+5 à +38 €** |
| M7-M9 | 2 000-6 000 | 15-45 | 75-225 € | **+38 à +152 €** |
| M10-M12 | 6 000-15 000 | 45-105 | 225-525 € | **+152 à +380 €** |

| Année | Ventes/mois (moy.) | CA annuel | Net annuel |
|---|---|---|---|
| An 1 | ~40/mois | ~2 400 € | **~+1 500 €** |
| An 2 | ~200/mois | ~12 000 € | **~+8 500 €** |
| An 3 | ~600/mois | ~36 000 € | **~+26 000 €** |

### 6.4 Tableau de break-even détaillé

#### Break-even mensuel (an 1, sans CFE)

```
Charges fixes : 19,25 €/mois

Pour couvrir les charges :
CA × (1 - 0,237) = 19,25 €
CA × 0,763 = 19,25 €
CA minimum = 25,23 €/mois

Nombre de ventes à 5 € commission : 25,23 / 5 = ~6 ventes/mois
```

**Break-even : 6 ventes référencées par mois** (an 1)
**Break-even : 9 ventes référencées par mois** (an 2+, avec CFE)

#### Break-even trafic

```
6 ventes × (1/0,007 visiteurs/vente) = ~860 visiteurs/mois
→ Soit environ 30 visiteurs par jour
```

**30 visiteurs/jour est un objectif très accessible avec du contenu SEO ciblé.**

### 6.5 Projection du cash-flow sur 3 ans (scénario réaliste)

```
Mois:    1   2   3   4   5   6   7   8   9  10  11  12
CA (€):  5  10  15  20  30  40  55  70  90 110 130 150
         
         Net mensuel (€)
         ────────────────────────────────────────────────
         -19 -15 -11  -7  +4 +12 +23 +35 +50 +65 +81 +96
              ↑
         Break-even : mois 5-6
```

### 6.6 Investissement initial et fonds nécessaires

| Poste | Coût | Note |
|---|---|---|
| Développement site | 0 € | Fait soi-même |
| Nom de domaine (1 an) | 15 € | À acheter |
| Création micro-entreprise | 0 € | Gratuit URSSAF |
| Vercel Pro (1 mois) | 18 € | Ou continuer Hobby au départ |
| **TOTAL DÉMARRAGE** | **~33 €** | |

C'est l'un des projets entrepreneuriaux les moins capitalistiques qui existent. **33 € pour lancer un business.**

---

## 7. STRATÉGIE MARKETING & ACQUISITION

### 7.1 Phase 1 — M0 à M6 : Fondations SEO (gratuit)

#### Contenu cible (fiches produits)

Chaque fiche produit indexée sur Google est une porte d'entrée permanente. Priorité aux produits à forte intention d'achat et prix élevé :

**Catégories cibles (commissions les plus élevées) :**
- Casques Bluetooth haut de gamme (Sony, Apple, Bose) — 200-400 €
- Claviers mécaniques gaming — 100-300 €
- Écouteurs true wireless — 100-250 €
- Appareils photo / objectifs — 300-800 €
- Consoles et accessoires gaming — 50-500 €

**Mots-clés SEO cibles :**
- "[produit] prix Amazon Europe"
- "acheter [produit] moins cher"
- "[produit] Amazon.de livraison France"
- "meilleur prix [produit] Amazon"
- "comparer prix Amazon France Allemagne [produit]"

**Volume de contenu cible :**
- M1-M3 : 20-30 fiches produits indexées
- M4-M6 : 50-80 fiches produits
- M7-M12 : 150-200 fiches produits

#### Pages de catégorie (SEO long terme)
- "Meilleurs prix casques Bluetooth sur Amazon Europe"
- "Sony WH série : comparaison prix Amazon"
- "Économiser sur Amazon.de depuis la France : guide complet"

### 7.2 Phase 2 — M3 à M9 : Contenu court-format (viralité)

#### TikTok / Instagram Reels

**Format prouvé qui fonctionne :**
```
Accroche : "J'ai payé mon casque Sony 47 € moins cher"
Développement : "Amazon France vs Amazon Allemagne, voilà le résultat"
[Montrer l'interface EuroComp en action]
CTA : "Lien dans ma bio → eurocompare.fr"
```

**La pub Remotion déjà en cours de création** = exactement ce contenu.

**Cadence recommandée :** 3-4 posts/semaine minimum. Le SEO prend 3-6 mois, TikTok peut générer du trafic en 24h.

**Topics qui fonctionnent sur TikTok tech/bonplan :**
- "J'ai économisé X€ sur [produit populaire]"
- "Le truc qu'Amazon ne veut pas que tu saches"
- "Amazon.de vs Amazon.fr : résultats choquants sur [produit]"
- "Comment les Allemands paient moins cher qu'nous"

#### YouTube Shorts (syndication du contenu TikTok)
Republier les TikTok sur YouTube Shorts = double la portée sans effort supplémentaire.

### 7.3 Phase 3 — M6 à M18 : Communauté & Réputation

#### Reddit et forums
- r/bonsplans (France) — partager les deals du moment
- r/france — "Astuce : comparer Amazon.fr vs Amazon.de avant d'acheter"
- Forum Hardware.fr — audience tech qui achète souvent
- Discord gaming / tech — partage naturel

**Règle d'or :** Ne pas spammer. Contribuer genuinement. Un partage naturel depuis un compte actif vaut 100x un post publicitaire.

#### Email / Newsletter (an 2)
"L'alerte bon plan" : email hebdomadaire avec les 5 meilleures économies du moment.
→ Fidélisation + revenu récurrent potentiel (affiliation sur chaque newsletter)

### 7.4 Investissement publicitaire payant (optionnel)

**Recommandation : éviter au départ.**

Les publicités payantes (Meta Ads, TikTok Ads, Google Ads) peuvent être rentables à grande échelle mais :
- Coût d'acquisition client (CAC) > commission moyenne en phase de démarrage
- Risque de brûler le budget sans résultats mesurables
- Le SEO + TikTok organique est suffisant pour valider le modèle

**Envisager les publicités payantes uniquement** si :
- Le site génère déjà 1 000+ visiteurs organiques/mois
- Le taux de conversion est validé (>0,5 %)
- Budget disponible de 100-200 €/mois à risquer

### 7.5 Métriques de suivi essentielles

| Métrique | Outil | Objectif 6 mois | Objectif 12 mois |
|---|---|---|---|
| Visiteurs mensuels | Vercel Analytics | 1 000 | 5 000 |
| Clics affiliés | Amazon Associates Dashboard | 150 | 750 |
| Ventes générées | Amazon Associates | 10 | 50 |
| Taux de clic (CTR) | Amazon Associates | >12 % | >15 % |
| Taux de conversion | Calculé | >6 % | >8 % |
| Pages indexées Google | Search Console | 30 | 150 |
| Position moyenne | Search Console | <50 | <20 |

---

## 8. ASPECTS LÉGAUX & RÉGLEMENTAIRES

### 8.1 Structure juridique recommandée

**Statut : Micro-entrepreneur (auto-entrepreneur)**

Démarches :
1. Inscription sur autoentrepreneur.urssaf.fr (15 min, gratuit)
2. Réception du SIRET sous 5-10 jours
3. Ouverture d'un compte bancaire dédié (obligatoire dès 10 000 €/an de CA)

Code APE à déclarer : **7311Z** (Activités des agences de publicité) ou **6319Z** (Autres activités de services d'information)

### 8.2 Obligations fiscales

**Déclarations URSSAF :**
- Mensuelle ou trimestrielle (au choix)
- Déclarer le CA encaissé (commissions Amazon reçues)
- Payer 22 % + 1,7 % (versement libératoire) sur le CA déclaré

**Si CA = 0 un mois/trimestre : déclarer 0 — aucun paiement.**

**Impôt sur le revenu :**
Option A (recommandée au départ) : Versement libératoire = 1,7 % du CA, payé en même temps que l'URSSAF. Simple, pas de surprise.
Option B : Intégration dans la déclaration de revenus annuelle (IR). Potentiellement plus avantageux si revenus annexes modestes.

### 8.3 Obligations légales du site

**Pages obligatoires (déjà créées sur EuroComp) :**
- ✅ Mentions légales (SIRET à ajouter dès création micro-entreprise)
- ✅ Politique de confidentialité
- ✅ Page cookies + bannière consentement
- ⏳ CGU (Conditions Générales d'Utilisation)
- ⏳ Page dédiée affiliation

**Mentions obligatoires depuis la loi "Influence" 2023 :**
Tout lien affilié doit être clairement identifié. Formulation recommandée :
> "Ce site contient des liens d'affiliation Amazon. En cas d'achat via ces liens, EuroComp perçoit une commission sans surcoût pour vous."

Cette mention doit apparaître :
- Dans le footer du site
- Sur chaque page produit (à proximité des liens)
- Dans la page dédiée à la transparence/affiliation

### 8.4 Conformité RGPD

**Données collectées :**
- Cookies analytiques (Vercel Analytics) — consentement requis ✅
- Aucune donnée personnelle stockée sur les utilisateurs

**À ne pas faire sans consentement explicite :**
- Email marketing sans opt-in clair
- Tracking publicitaire (retargeting)
- Partage de données avec des tiers sans mention

### 8.5 Relations avec Amazon

**Conditions du programme Associates :**
- Interdiction d'afficher les prix de façon statique (doivent être en temps réel ou avec avertissement "prix susceptible de changer")
- Pas de cookie stuffing (pratiques d'affiliation frauduleuses)
- Le lien affilié doit mener directement à Amazon, pas être masqué
- Les prix affichés doivent inclure la TVA et être en EUR

**Bonne pratique :** Afficher la date de dernière mise à jour du prix sur chaque fiche.

### 8.6 Propriété intellectuelle

- Le nom "EuroComp" / "EuroCompare" — vérifier la disponibilité sur INPI avant de déposer le nom de domaine et de créer la micro-entreprise sous ce nom
- Les images produits : utiliser uniquement les images via l'API Amazon (autorisées) ou des images libres de droits. Ne jamais scraper les images Amazon.fr directement.

---

## 9. ANALYSE DES RISQUES

### 9.1 Matrice des risques

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Amazon révoque l'accès PA-API (< 3 ventes en 180j) | Moyenne | Élevé | Bootstrap : demander à des proches d'acheter via les liens |
| Modification des taux de commission Amazon | Moyenne | Moyen | Diversifier avec Google AdSense + autres affiliations (Fnac, Darty) |
| Concurrent bien financé copie le concept | Faible | Élevé | Avance SEO, marque, communauté = barrières |
| Google change son algorithme (pénalité SEO) | Faible | Élevé | Diversifier les sources de trafic (TikTok, email) |
| Vercel augmente ses prix ou change ses CGU | Très faible | Faible | Migration vers Netlify ou Railway possible |
| Abandon du projet faute de motivation | Moyenne | Élevé | Voir section 9.2 |

### 9.2 Le risque spécifique "premier projet"

C'est ton premier projet entrepreneurial. Les statistiques sont réalistes : la grande majorité des premiers projets sont abandonnés avant 6 mois, non pas parce qu'ils sont mauvais, mais parce que :

- Les résultats tardent (SEO = 3-6 mois)
- La solitude (pas d'équipe, pas de validation externe)
- Le découragement face à un trafic encore faible

**Plan anti-abandon :**
1. **Fixer un engagement minimum :** "Je teste pendant 12 mois quelle que soit la progression"
2. **Mesurer les bons indicateurs au départ :** Pas le CA mais le nombre de fiches créées, de visiteurs, de clics
3. **Célébrer les micro-victoires :** 1ère indexation Google, 1er visiteur, 1er clic affilié, 1ère vente
4. **Trouver une communauté :** IndieHackers, r/entrepreneur, makers.dev
5. **Documenter publiquement :** "Build in public" sur Twitter/X = audience + accountability

### 9.3 Scénario de sortie (si échec)

**Coût de l'échec si abandon au bout de 12 mois :**
- Temps investi : beaucoup, mais c'est de l'apprentissage non-récupérable dans les deux cas
- Argent perdu : 200-300 € (domaine + Vercel Pro)
- Ce qu'on garde : les compétences Next.js, GSAP, SEO, le code réutilisable, l'expérience entrepreneuriale

**Un projet "raté" à 300 € de perte est en fait une formation à 300 €.**

---

## 10. FEUILLE DE ROUTE (18 MOIS)

### Phase 0 — Fondations (Terminé / En cours)
- ✅ Développement du site
- ✅ Déploiement Vercel
- ✅ SEO technique (JSON-LD, sitemap, Search Console)
- ✅ Pages légales, RGPD
- ⏳ Achat nom de domaine (eurocompare.fr ou .com) — **PRIORITÉ 1**
- ⏳ Création micro-entreprise — **PRIORITÉ 2 (dès premières commissions)**
- ⏳ Inscription Amazon Associates FR + DE + ES + IT + NL

### Phase 1 — M1 à M3 : Contenu & API (Mois 1-3)

**Objectifs :**
- Intégrer Amazon PA-API
- Créer 30 fiches produits avec données réelles
- Publier 20-30 TikToks/Reels
- Atteindre 3 premières ventes (garder l'accès API)

**Actions concrètes :**
- Sélectionner 30 produits à forte demande et forte commission
- Optimiser chaque fiche pour le SEO (title, H1, description, balises)
- Créer la série TikTok "Je vous montre combien vous payez en trop sur Amazon"
- Partager sur Reddit /r/bonsplans 1-2 fois par semaine

### Phase 2 — M4 à M6 : Optimisation & Croissance

**Objectifs :**
- 200-500 visiteurs/mois
- Break-even atteint (6+ ventes/mois)
- 50-80 fiches produits indexées

**Actions concrètes :**
- Analyser quelles fiches génèrent du trafic (Search Console) → renforcer ces catégories
- A/B tester les CTA ("Acheter sur Amazon.de" vs "Voir le meilleur prix")
- Créer des pages de comparaison catégorielles (ex: "Meilleurs prix casques Bluetooth")
- Commencer à construire une présence sur Pinterest (trafic très sous-estimé pour le e-commerce)

### Phase 3 — M7 à M12 : Scale

**Objectifs :**
- 1 000-5 000 visiteurs/mois
- 30-100 ventes/mois
- 150+ fiches produits

**Actions concrètes :**
- Automatiser la mise à jour des prix via PA-API (tâche cron)
- Envisager une newsletter "Top économies de la semaine"
- Analyser les données internes : quels produits convertissent le mieux ?
- Créer des guides achat (ex : "Guide ultime : acheter ses écouteurs moins cher en Europe")

### Phase 4 — M13 à M18 : Consolidation & Nouvelles Revenues

**Objectifs :**
- 5 000-20 000 visiteurs/mois
- 100-500 ventes/mois
- Première revenu significatif (500-2 000 €/mois net)

**Actions concrètes :**
- Évaluer l'ajout de Google AdSense (si trafic suffisant)
- Envisager les partenariats avec des créateurs tech (codes affiliés)
- Explorer l'extension à d'autres pays (Belgique, Suisse)
- Envisager le passage en SASU si CA > 30 000 €/an

---

## 11. CONCLUSION & VISION LONG TERME

### Ce projet est une opportunité réelle

EuroComp n'est pas une idée hypothétique. C'est une vraie réponse à un vrai problème que vivent des millions de consommateurs européens chaque jour. Le marché existe, la demande existe, et la fenêtre d'opportunité est ouverte.

### Ce que tu as déjà accompli (et qui est remarquable)

Construire ce site de zéro, avec une UX premium, des animations avancées, du SEO structuré, du RGPD, c'est ce que des agences web facturent 15 000-50 000 € à leurs clients. Tu l'as fait seul, sur ton premier projet. C'est une compétence qui a une valeur marchande immédiate, indépendamment du succès ou non d'EuroComp.

### Vision 3-5 ans

Si EuroComp fonctionne et atteint 10 000+ visiteurs/mois :
- **Revenu passif :** Le contenu SEO génère des revenus sans travail quotidien
- **Asset valorisable :** Un site e-commerce affilié avec trafic se revend 24-36× le CA mensuel (Flippa, Acquire.com)
- **Tremplin :** Les compétences et le réseau acquis ouvrent d'autres opportunités (consulting, SaaS, formation)

### Le conseil le plus important

**Lance. Ajuste. Continue.**

La différence entre un projet qui réussit et un projet qui échoue n'est presque jamais la qualité de l'idée initiale. C'est la persévérance et la capacité à s'adapter aux retours du marché réel. Aucun business plan, aussi détaillé soit-il, ne remplace un utilisateur réel sur le site.

Tu as fait le plus dur : construire le produit. La suite, c'est du travail régulier, des ajustements, et du temps.

---

## ANNEXES

### A. Simulateur de rentabilité rapide

```
Formule :
Net mensuel = CA - (CA × 0,237) - 19,25 - CFE_mensuel

CA = Nombre de ventes × Commission moyenne

Exemple :
30 ventes × 5 € = 150 € de CA
150 × 0,763 = 114,45 €
114,45 - 19,25 - 0 (an 1) = 95,20 € net/mois
```

### B. Ressources utiles

- **Amazon Associates :** affiliate-program.amazon.fr
- **Création micro-entreprise :** autoentrepreneur.urssaf.fr
- **Vérification disponibilité marque :** inpi.fr/bases-de-donnees
- **Outils SEO gratuits :** Google Search Console, Ubersuggest (limité gratuit)
- **Communauté makers FR :** indie-makers.fr, IndieHackers.com

### C. Tableau récapitulatif des seuils importants

| Seuil | Montant | Conséquence |
|---|---|---|
| Break-even mensuel | ~30 €/mois CA | Plus de perte nette (an 1) |
| Seuil TVA franchise | 36 800 €/an | En dessous : pas de TVA |
| Seuil CFE | 5 000 €/an | En dessous : exonéré |
| Plafond micro-entreprise | 77 700 €/an | Au-delà : changer de statut |
| Seuil compte bancaire dédié | 10 000 €/an | Obligation légale |

---

*Document rédigé en juin 2026 — À réviser tous les 6 mois en fonction de l'évolution du projet.*
*Ce document est à usage interne et ne constitue pas un conseil juridique ou fiscal certifié.*
