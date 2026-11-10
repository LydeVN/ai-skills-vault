# SkillVault AI ⚡ (Coffre de Compétences IA)

**SkillVault AI** est une application web moderne pour stocker, organiser, paramétrer, tester et exporter votre collection de compétences IA, prompts d'agents, instructions système et déclarations d'outils Model Context Protocol (MCP).

---

## 🌟 Nouvelles Fonctionnalités & Améliorations

- 📖 **Visionneuse Markdown Intégrée (.md Viewer)** :
  - Visualisation riche des documents et prompts avec rendu Markdown complet (titres hiérarchisés, tableaux stylisés, listes, blocs de code avec coloration syntaxique, citations et étiquettes).
  - Navigation par onglets dans les détails d'une compétence :
    1. **Aperçu Markdown Rendu** (*Rendered Markdown*)
    2. **Prompt Assemblé** (*Assembled Prompt*) avec injection dynamique des variables
    3. **Modèle Brut** (*Raw Template*)
    4. **Spécification .SKILL.md** complète (prête pour Antigravity / Cursor)
  - Rendu Markdown temps réel dans le **Simulateur d'IA & Bac à sable**.

- 🇫🇷 **Version Française Complète & Syntaxe Cohérente** :
  - Bascule instantanée entre **Français 🇫🇷** et **Anglais 🇬🇧** dans l'en-tête (mémorisée dans le navigateur).
  - Traduction soignée et naturelle respectant la terminologie informatique et IA (*"Stocker une compétence"*, *"Raisonnement pas à pas"*, *"Clauses de garde"*, *"Audit OWASP"*, *"Variables dynamiques"*, etc.).
  - Compétences d'usine enrichies avec des compétences natives en français (Audit RGPD, Ingénierie de Prompts Few-Shot, etc.).

- ⚡ **Paramètres Dynamiques (`{{variable}}`)** :
  - Détection automatique des variables dans les templates.
  - Formulaires interactifs en direct pour injecter vos paramètres.

- 🧪 **Simulateur & Bac à Sable IA** :
  - Exécution simulée avec streaming de pensées (*Chain of Thought*) et génération de code/tableaux formatés en Markdown.
  - Prise en charge optionnelle d'une clé d'API Google Gemini pour des requêtes réelles.

- 🔄 **Sauvegarde, Restauration & Exportation** :
  - Export de tout le coffre au format JSON ou document Markdown consolidé.
  - Exportation individuelle au format `.SKILL.md`.

---

## 🚀 Démarrage Rapide

```bash
cd "C:\Users\jvannelli\.gemini\antigravity\scratch\ai-skills-vault"
npm install
npm run dev
```

Accédez à l'application dans votre navigateur :
👉 **[http://localhost:5173](http://localhost:5173)**
