// Module prévu pour détecter le type de demande (commande, plainte, etc.)
const detectIntent = (text) => {
  if (text.toLowerCase().includes("commande")) return "Commande";
  if (text.toLowerCase().includes("plainte")) return "Plainte";
  if (text.toLowerCase().includes("adresse") || text.toLowerCase().includes("où")) return "Information";
  return "Général";
};

module.exports = { detectIntent };
