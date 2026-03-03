// sapHanaService.js

const odbc = require('odbc');
require('dotenv').config();
const connectionString = `
  Driver=HDBODBC;
  ServerNode=${process.env.HANA_SERVER};
  UID=${process.env.HANA_UID};
  PWD=${process.env.HANA_PWD};
`;

//connect function
async function connectFonction(sql) {
  try {
    const connection = await odbc.connect(connectionString);
    
    const result = await connection.query(sql);
    
    await connection.close();
    return result;
  } catch (error) {
    console.error('Erreur SAP HANA :', error);
    throw error;
  }
}
//http request
const httpFonctionGet = async (req,res,sql) =>{

try {
    const X = await connectFonction(sql); 
    console.log(X)
    res.status(200).json(X);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des données" });
  }

}




const ChiffreAffaireAnnuel = async (req,res)=>{
  const sql = ` 
SELECT
    YEAR(T0."DocDate") AS "annee",
    SUM(T0."DocTotal" - T0."VatSum") AS "ChiffreAffaire_HT_annuel"
FROM "CAPING_PROD".OINV T0
WHERE T0."CANCELED" = 'N' 
GROUP BY YEAR(T0."DocDate") 
ORDER BY "annee"  
         
`;

  httpFonctionGet(req,res,sql);
}


const ChifferAffaire = async (req,res)=>{
 const sql = `     
SELECT
    EXTRACT(YEAR FROM F."DocDate") AS "Annee",
    TO_VARCHAR(F."DocDate", 'Month') AS "MoisNom",
    EXTRACT(MONTH FROM F."DocDate") AS "MoisNum",
    SUM(F."DocTotal") AS "ChiffreAffaires_TTC",
    SUM(F."VatSum") AS "TVA",
    SUM(F."DocTotal" - F."VatSum") AS "ChiffreAffaires_HT"
FROM "CAPING_PROD"."OINV" F
WHERE F."CANCELED" = 'N'
  AND EXTRACT(YEAR FROM F."DocDate") = ${req.params.id}
GROUP BY
    EXTRACT(YEAR FROM F."DocDate"),
    EXTRACT(MONTH FROM F."DocDate"),
    TO_VARCHAR(F."DocDate", 'Month')
ORDER BY
    "Annee",
    "MoisNum";
    `
  
  httpFonctionGet(req,res,sql);
}


const projects_info = async (req,res)=>{
  const sql = `
  SELECT 
    T1."PrjName" AS "name",
    SUM(T0."DocTotal") AS "total"
  FROM "CAPING_PROD".OPOR T0
    LEFT JOIN "CAPING_PROD".OPRJ T1 ON T0."Project" = T1."PrjCode"
    WHERE YEAR(T0."DocDate") = 2025
    AND T0."Project" IS NOT NULL
    GROUP BY T0."Project", T1."PrjName"
    ORDER BY "total" DESC
    LIMIT 4
`
httpFonctionGet(req,res,sql)
}

const getTop10 = async (req,res)=>{
const sql = `
SELECT
    T0."CardCode" AS "Fournisseur",
    T0."CardName" AS "Nom_Fournisseur",
    SUM(T0."DocTotal") AS "Chiffre_Affaire"
FROM "CAPING_PROD".OPDN T0
WHERE YEAR(T0."DocDate") = 2025
GROUP BY T0."CardCode", T0."CardName"
ORDER BY  "Chiffre_Affaire" DESC
LIMIT 10;

    `;
httpFonctionGet(req,res,sql)
}

const NombreCommande = async (req,res)=>{
 const sql = `
      SELECT  
      MONTH(T0."DocDate") AS "mois",
      SUM(1) AS "Nombre_commande"
      FROM "CAPING_PROD".OPOR T0
      WHERE YEAR(T0."DocDate") = 2025
      GROUP BY YEAR(T0."DocDate"), MONTH(T0."DocDate")
      ORDER BY YEAR(T0."DocDate"), MONTH(T0."DocDate")
    `;
httpFonctionGet(req,res,sql)
}



const Marchier = async (req,res)=>{
  const sql = `
  SELECT
       *
  FROM "CAPING_PROD".INV1 T1
 ;
`;
httpFonctionGet(req,res,sql)

}



const Delai = async (req,res)=>{
const Annee = req.query.annee ;
const limit = req.query.limit ;
  const sql = `
SELECT 
  T0."CardCode" AS "Fournisseur",
  T0."CardName" AS "Nom_Fournisseur",
  AVG(DAYS_BETWEEN(T2."DocDate" ,T0."DocDate") ) AS "AVG",
  SUM(T0."DocTotal") AS "Chiffre_Affaire"
FROM "CAPING_PROD".OPDN T0
INNER JOIN (
  SELECT DISTINCT "DocEntry", "BaseEntry","DocDate"
  FROM "CAPING_PROD".PDN1
) T1 ON T1."DocEntry" = T0."DocEntry"
INNER JOIN "CAPING_PROD".OPOR T2 ON T1."BaseEntry" = T2."DocEntry"
 WHERE T0."DocDate"  > T2."DocDate" ${Annee === 'ALL' ? '' : `AND YEAR(T0."DocDate") = ${Annee} `} 
GROUP BY  T0."CardCode" , T0."CardName"
ORDER BY "Chiffre_Affaire" DESC
LIMIT ${limit}

    `;
httpFonctionGet(req,res,sql)
}




const Avancement_Projct = async (req,res)=>{
  const sql = `
  SELECT 
    P."PrjCode",
    P."PrjName",
    COALESCE(F."ChiffreAffaire_HT",0) AS "ChiffreAffaire_HT",
    COALESCE(A."Cout_HT",0) AS "Cout_HT",
    ("ChiffreAffaire_HT"-"Cout_HT")*100/"ChiffreAffaire_HT" AS "Rentabilite"
FROM "CAPING_PROD".OPRJ P
INNER JOIN (
    SELECT "Project", SUM("DocTotal" - "VatSum") AS"Cout_HT"
    FROM "CAPING_PROD".OPCH
    GROUP BY "Project"
) A ON A."Project" = P."PrjCode"
 INNER JOIN (
    SELECT "Project", SUM("DocTotal" - "VatSum") AS "ChiffreAffaire_HT"
    FROM "CAPING_PROD".OINV
    GROUP BY "Project"
) F ON F."Project" = P."PrjCode"
WHERE P."Active" = 'Y' AND P."Locked" = 'N' 
 ORDER BY "ChiffreAffaire_HT" DESC
 LIMIT 10 ;
  `

  httpFonctionGet(req,res,sql); 
}




module.exports = { Avancement_Projct, NombreCommande, projects_info , getTop10 , ChifferAffaire, Marchier,ChiffreAffaireAnnuel,Delai};
