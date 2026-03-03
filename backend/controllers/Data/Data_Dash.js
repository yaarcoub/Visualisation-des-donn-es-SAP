const path = require("path");
const xlsx = require("xlsx");
const dayjs = require("dayjs");



 const getData = async (arg) => {
  const filePath = path.join(__dirname, "Data.xlsx");
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[arg];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return data;
};


const top10F = async () => {
 const data = await getData(1); 

const NMonthsAgo = dayjs().subtract(3, "month");

const filteredData = data.filter(row => {
  const mois = Number(row.MONTH);
  const annee = Number(row.YEAR);
  const date = dayjs(`${annee}-${String(mois).padStart(2, "0")}-01`);
  return date.isAfter(NMonthsAgo);
});

const totalsBySupplier = {};
filteredData.forEach(row => {
  const F = 'Nom Fournisseur'
  const fournisseur = row[F];
  const montant = Number(row.Prix) || 0;
  totalsBySupplier[`${fournisseur}`] = (totalsBySupplier[`${fournisseur}`] || 0) + montant;
});

const top10 = Object.entries(totalsBySupplier)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([fournisseur, total]) => ({ fournisseur, total }));

 return top10 ;
};



const achatsParMois =async () => {

 const data = await getData(1); 
  const anneeEnCours = dayjs().year(); 

  const dataAnnee = data.filter(row => Number(row.YEAR) === anneeEnCours);

  const totauxMois = {}; 

    dataAnnee.forEach(row => {
    const mois = Number(row.MONTH);
    const prix = Number(row.Prix) || 0;
    const quantiter = Number(row.Quantité) || 0 ;
    const montant = quantiter*prix

    if (!totauxMois[mois]) totauxMois[mois] = 0;
    totauxMois[mois] += montant;
  });

    
const mois_totaux =  Object.entries(totauxMois).map(([mois, total]) => ({ mois, total }));
  
  return mois_totaux;
};

//nombre de transfer par mois
const APT = async (Source, Cible) => {
  const data = await getData(0);
  const anneeEnCours = dayjs().year(); 
  const dataAnnee = data.filter(row => Number(row.YEAR) === anneeEnCours);

  const Data_Work = dataAnnee.filter((row) => {
    
    if (
      row['Magasin Source Nom']?.toString() === Source &&
      row['Magasin Cible Nom']?.toString() === Cible
    ) {
      return row;
    }
  });

  const Data_Result = {}
  Data_Work.forEach(row => {
  const Articl = row['ItemCode'];
  const quantiter = Number(row.Quantity) || 0;
  Data_Result[`${Articl}`] = (Data_Result[`${Articl}`] || 0) + quantiter;
});

 const A10 = Object.entries(Data_Result)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([ItemCode, total]) => ({ ItemCode, total }));

  return A10;
};



const R_Project = async ()=>{
   const data = await getData(1); 
  const anneeEnCours = dayjs().year();
  const dataAnnee = data.filter(row => Number(row.YEAR) === anneeEnCours);

  const consommationParProject = {};
    
  dataAnnee.forEach(row => {

  const Project = row.PrjName;
  const prix = Number(row.Prix) || 0;
  const quantiter = Number(row.Quantité) || 0 ;
  const montant = quantiter*prix
  
  if (!consommationParProject[Project]) consommationParProject[Project] = 0;
    consommationParProject[Project]+= montant;
})

const top4 = Object.entries(consommationParProject)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4)
  .map(([project, total]) => ({ name:project, total }));

return top4;
}



const Achat = async (req, res) => {

  try {
    const AchatparMois = await achatsParMois(); 
    res.status(200).json(AchatparMois);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des données" });
  }
};



const APT_R = async (req, res) => {
  try {
    const A10 = await APT(req.body.Source , req.body.Cible); 
    res.status(200).json(A10);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des données" });
  }
};


const projects_info = async (req,res)=>{
try {
    const P = await R_Project(); 
    res.status(200).json(P);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des données" });
  }
}






const getTop10 = async (req, res) => {
  try {
    const top10Data = await top10F(); 
    res.status(200).json(top10Data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des données" });
  }
};



module.exports = {getTop10,Achat,projects_info,APT_R};

