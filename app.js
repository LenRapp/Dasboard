export default function (app) {
  const notion = app.locals.notion;
  const databaseId = app.locals.databaseId;

  app.get("/", async (req, res) => {
    try {
      const { results: entries } = await notion.databases.query({ database_id: databaseId });

      let html = `
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Dashboard Notion</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { text-align: center; }
              table { border-collapse: collapse; width: 90%; margin: auto; }
              th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
              th { background-color: #f0f0f0; }
              .badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
              }
              .Terminé { background-color: #d4edda; color: #155724; }
              .AFaire { background-color: #d1ecf1; color: #0c5460; }
              .EnCours { background-color: #f8d7da; color: #721c24; }
            </style>
          </head>
          <body>
            <h1>Dashboard Notion</h1>
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Date</th>
                  <th>Case à cocher</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
      `;

      for (const entry of entries) {
        const props = entry.properties;
        const nom = props["Nom"]?.title?.[0]?.plain_text || "Sans titre";
        const date = props["Date"]?.date?.start || "—";
        const check = props["Case à cocher"]?.checkbox ? "✅" : "❌";
        const statut = props["Sélection multiple"]?.multi_select?.[0]?.name || "—";
        const badgeClass = statut.replace(/\s+/g, ''); // pour les classes CSS

        html += `
          <tr>
            <td>${nom}</td>
            <td>${date}</td>
            <td>${check}</td>
            <td><span class="badge ${badgeClass}">${statut}</span></td>
          </tr>
        `;
      }

      html += `
              </tbody>
            </table>
          </body>
        </html>
      `;

      res.send(html);
    } catch (err) {
      console.error("❌ Erreur dans / :", err);
      res.status(500).send("Erreur serveur lors du chargement des données");
    }
  });
}
