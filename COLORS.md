# Palette de Couleurs - Tektal App

## Couleurs Principales

### Couleur Principale

- **Code hexadécimal** : `#093FB4`
- **Utilisation** : Boutons principaux, liens, titres, éléments d'interface importants
- **Variations** :
  - `#1A4FC4` (plus claire)
  - `#072A7A` (plus foncée)

### Couleur d'Arrière-plan

- **Code hexadécimal** : `#FFFCFB`
- **Utilisation** : Arrière-plan principal, cartes, conteneurs
- **Description** : Blanc cassé très subtil

### Couleur d'Accent

- **Code hexadécimal** : `#FFD8D8`
- **Utilisation** : Bordures, arrière-plans secondaires, éléments décoratifs
- **Variations** :
  - `#FFE8E8` (plus claire)
  - `#FFC0C0` (plus foncée)

### Couleur d'Alerte

- **Code hexadécimal** : `#ED3500`
- **Utilisation** : Messages d'erreur, boutons de suppression, alertes
- **Description** : Rouge-orange vif

## Variables CSS

Toutes les couleurs sont définies dans `src/styles.css` avec les variables CSS suivantes :

```css
:root {
  --primary-color: #093fb4;
  --background-color: #fffcfb;
  --accent-color: #ffd8d8;
  --alert-color: #ed3500;

  /* Variations */
  --primary-light: #1a4fc4;
  --primary-dark: #072a7a;
  --accent-light: #ffe8e8;
  --accent-dark: #ffc0c0;

  /* Couleurs de texte */
  --text-primary: #222;
  --text-secondary: #666;
  --text-light: #999;
  --text-white: #fffcfb;

  /* Couleurs de fond */
  --bg-primary: #fffcfb;
  --bg-secondary: #f8f8f8;
  --bg-accent: #ffd8d8;

  /* Couleurs d'état */
  --success-color: #28a745;
  --warning-color: #ffc107;
  --error-color: #ed3500;
  --info-color: #093fb4;
}
```

## Classes Utilitaires

### Couleurs de Texte

- `.text-primary` : Couleur principale
- `.text-accent` : Couleur d'accent
- `.text-muted` : Texte secondaire

### Couleurs d'Arrière-plan

- `.bg-primary` : Arrière-plan principal
- `.bg-accent` : Arrière-plan d'accent
- `.bg-light` : Arrière-plan clair

### Boutons

- `.btn-primary` : Bouton principal (bleu)
- `.btn-secondary` : Bouton secondaire (rose)
- `.btn-danger` : Bouton d'alerte (rouge)

### Badges

- `.badge-primary` : Badge principal
- `.badge-accent` : Badge d'accent
- `.badge-alert` : Badge d'alerte

## Utilisation Recommandée

### Interface Utilisateur

1. **Navigation** : Utiliser la couleur principale pour les liens actifs
2. **Boutons** : Couleur principale pour les actions principales
3. **Cartes** : Arrière-plan principal avec bordures d'accent
4. **Formulaires** : Bordures d'accent avec focus sur la couleur principale

### Accessibilité

- Contraste suffisant entre le texte et l'arrière-plan
- Utilisation cohérente des couleurs pour les états (succès, erreur, avertissement)
- Support des thèmes sombres si nécessaire

### Responsive Design

- Les couleurs s'adaptent automatiquement aux différentes tailles d'écran
- Maintien de la lisibilité sur mobile

## Mise à Jour des Composants

Tous les composants existants ont été mis à jour pour utiliser cette nouvelle palette :

- `home.component.css`
- `lines.component.css`
- `search.component.css`
- `styles.css` (variables globales)

## Maintenance

Pour modifier la palette de couleurs :

1. Mettre à jour les variables CSS dans `src/styles.css`
2. Vérifier la cohérence dans tous les composants
3. Tester l'accessibilité et le contraste
4. Documenter les changements
