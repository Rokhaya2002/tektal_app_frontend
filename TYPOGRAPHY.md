# Typographie - Tektal App

## Polices Utilisées

### 1. Bangers (Titres Principaux)

- **Source** : Google Fonts
- **Utilisation** : Titres H1, H2, H3, noms de lignes, titres de sections
- **Style** : Police display avec un style comic/BD
- **Classes CSS** : `.bangers-title`, `.bangers-subtitle`

```css
.bangers-title {
  font-family: "Bangers", cursive;
  font-size: 2.5rem;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(9, 63, 180, 0.2);
}
```

### 2. Inter (Texte Principal)

- **Source** : Google Fonts
- **Utilisation** : Corps de texte, paragraphes, boutons, formulaires
- **Style** : Police sans-serif moderne et lisible
- **Poids** : 400, 500, 600, 700, 800

```css
body,
p,
span,
button,
input {
  font-family: "Inter", Arial, sans-serif;
  font-weight: 500;
  letter-spacing: 0.2px;
}
```

### 3. Sora (Éléments Spéciaux)

- **Source** : Google Fonts
- **Utilisation** : Statistiques, icônes, éléments en gras
- **Style** : Police géométrique moderne
- **Poids** : 600, 700, 800

```css
.stat-number,
.stat-icon,
.action-icon {
  font-family: "Sora", Arial, sans-serif;
  text-transform: uppercase;
  font-weight: 800;
}
```

## Hiérarchie Typographique

### Niveaux de Titres

1. **H1** : Titres de page principaux (Bangers)
2. **H2** : Titres de section (Bangers)
3. **H3** : Sous-titres (Bangers)
4. **H4-H6** : Titres mineurs (Inter)

### Tailles Responsives

```css
/* Desktop */
.bangers-title {
  font-size: 2.5rem;
}
.bangers-subtitle {
  font-size: 1.8rem;
}

/* Tablette */
@media (min-width: 601px) and (max-width: 1024px) {
  .bangers-title {
    font-size: 2.2rem;
  }
  .bangers-subtitle {
    font-size: 1.6rem;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .bangers-title {
    font-size: 1.8rem;
  }
  .bangers-subtitle {
    font-size: 1.4rem;
  }
}
```

## Effets Visuels

### Ombres de Texte

- **Bangers** : Ombre douce pour la profondeur
- **Inter** : Pas d'ombre pour la lisibilité

### Animations

```css
@keyframes bangersSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

### Effets de Survol

- Ligne décorative sous les titres Bangers
- Changement de couleur pour les liens

## Utilisation par Composant

### Page d'Accueil

- **Logo** : Bangers pour le nom "Tektall"
- **Titre principal** : Bangers pour le slogan
- **Boutons** : Inter pour le texte

### Liste des Lignes

- **Titre de page** : Bangers
- **Noms de lignes** : Bangers
- **Informations** : Inter

### Page de Recherche

- **Titre principal** : Bangers
- **Sous-titres** : Bangers
- **Formulaires** : Inter

## Accessibilité

### Contraste

- Tous les textes respectent les ratios de contraste WCAG
- Couleurs adaptées pour la lisibilité

### Taille de Police

- Minimum 16px pour le texte principal
- Échelle typographique cohérente

### Espacement

- Letter-spacing approprié pour chaque police
- Line-height suffisant pour la lisibilité

## Maintenance

### Ajout de Nouvelles Polices

1. Importer dans `styles.css`
2. Définir les variables CSS
3. Créer les classes utilitaires
4. Tester sur différents appareils

### Modifications

- Toujours maintenir la hiérarchie
- Vérifier la lisibilité
- Tester la responsivité
- Documenter les changements
