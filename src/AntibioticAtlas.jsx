import React, { useState, useMemo } from 'react';
import { 
  Bug, Pill, Activity, ShieldAlert, Search, Menu, 
  Beaker, Stethoscope, GraduationCap, Info, 
  AlertTriangle, Brain, User, AlertOctagon, FileText, 
  CheckCircle, ArrowRight, Droplet, Heart, Shield,
  Thermometer, Book, Baby, RotateCw
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * ABX ATLAS DATA STORE - VERIFIED & ENHANCED
 * ------------------------------------------------------------------
 */

const METADATA = {
  region: "Central Ohio",
  version: "4.0.1-mobile-opt",
  lastUpdated: "2026-02-15",
  sources: ["IDSA", "Sanford Guide", "Ohio Dept of Health", "CDC"]
};

// --- MICROBES ---
const MICROBES = [
  // GRAM NEGATIVE
  { id: "escherichia_coli", name: "Escherichia coli", type: "gram-negative", category: "Enterobacterales", resistance: ["ESBL", "AmpC"], notes: "High fluoroquinolone resistance in Ohio." },
  { id: "escherichia_coli_esbl", name: "E. coli (ESBL)", type: "gram-negative", category: "Enterobacterales", resistance: ["ESBL"], notes: "Rising community prevalence." },
  { id: "klebsiella_pneumoniae", name: "Klebsiella pneumoniae", type: "gram-negative", category: "Enterobacterales", resistance: ["ESBL", "KPC"], notes: "Carbapenem resistance emerging." },
  { id: "pseudomonas_aeruginosa", name: "Pseudomonas aeruginosa", type: "gram-negative", category: "Non-fermenter", resistance: ["Efflux", "Porin loss"], notes: "ICU-associated pathogen." },
  { id: "acinetobacter_baumannii", name: "Acinetobacter baumannii", type: "gram-negative", category: "Non-fermenter", resistance: ["Carbapenem resistance"], notes: "Primarily ICU outbreaks." },
  { id: "stenotrophomonas_maltophilia", name: "Stenotrophomonas", type: "gram-negative", category: "Non-fermenter", resistance: ["Carbapenems"], notes: "Intrinsic carbapenem resistance. Use TMP-SMX." },
  { id: "enterobacter_cloacae", name: "Enterobacter cloacae", type: "gram-negative", category: "Enterobacterales", resistance: ["AmpC"], notes: "Avoid 3rd gen cephalosporins." },
  { id: "serratia_marcescens", name: "Serratia marcescens", type: "gram-negative", category: "Enterobacterales", resistance: ["AmpC"], notes: "Intrinsic resistance to Cefazolin." },
  { id: "bacteroides_fragilis", name: "Bacteroides fragilis", type: "gram-negative", category: "Anaerobe", resistance: ["Beta-lactamase"], notes: "High anaerobic prevalence." },
  { id: "neisseria_gonorrhoeae", name: "Neisseria gonorrhoeae", type: "gram-negative", category: "Diplococcus", resistance: ["Fluoroquinolones"], notes: "Dual therapy required." },
  { id: "neisseria_meningitidis", name: "Neisseria meningitidis", type: "gram-negative", category: "Diplococcus", resistance: [], notes: "Droplet precautions." },
  { id: "haemophilus_influenzae", name: "Haemophilus influenzae", type: "gram-negative", category: "Coccobacilli", resistance: ["Beta-lactamase"], notes: "Post-Hib vaccine epidemiology." },
  { id: "moraxella_catarrhalis", name: "Moraxella catarrhalis", type: "gram-negative", category: "Diplococcus", resistance: ["Beta-lactamase"], notes: "Pediatric ENT pathogen." },
  { id: "legionella_pneumophila", name: "Legionella pneumophila", type: "gram-negative", category: "Atypical", resistance: ["Beta-lactams"], notes: "Water source outbreaks." },
  
  // GRAM POSITIVE
  { id: "staphylococcus_aureus", name: "Staphylococcus aureus", type: "gram-positive", category: "Cocci", resistance: ["MRSA"], notes: "Community and hospital variants." },
  { id: "staphylococcus_epidermidis", name: "Staph epidermidis", type: "gram-positive", category: "Coag-Neg Staph", resistance: ["Biofilm", "Methicillin"], notes: "Common in prosthetic infections." },
  { id: "coagulase_negative_staphylococci", name: "Coag-Neg Staph", type: "gram-positive", category: "Gram-positive cocci", resistance: ["Methicillin"], notes: "Common contaminant; pathogen in devices." },
  { id: "streptococcus_pneumoniae", name: "Strep pneumoniae", type: "gram-positive", category: "Diplococci", resistance: ["Penicillin resistance"], notes: "Vaccine-modified epidemiology." },
  { id: "viridans_streptococci", name: "Viridans Strep", type: "gram-positive", category: "Cocci", resistance: [], notes: "Dental source common." },
  { id: "enterococcus_faecium", name: "Enterococcus faecium", type: "gram-positive", category: "Cocci", resistance: ["VRE"], notes: "Transplant-associated." },
  { id: "enterococcus_faecalis", name: "Enterococcus faecalis", type: "gram-positive", category: "Cocci", resistance: [], notes: "Usually Ampicillin susceptible." },
  { id: "listeria_monocytogenes", name: "Listeria monocytogenes", type: "gram-positive", category: "Rod", resistance: ["Cephalosporins (Intrinsic)"], notes: "Elderly, pregnant, immunocompromised." },
  { id: "streptococcus_pyogenes", name: "Group A Strep", type: "gram-positive", category: "Cocci", resistance: [], notes: "Necrotizing fasciitis cause." },
  { id: "streptococcus_agalactiae", name: "Group B Strep", type: "gram-positive", category: "Cocci", resistance: [], notes: "Neonatal sepsis risk." },
  { id: "clostridioides_difficile", name: "Clostridioides difficile", type: "gram-positive", category: "Anaerobe", resistance: ["Spore formation"], notes: "High healthcare burden." },
  { id: "nocardia_species", name: "Nocardia species", type: "gram-positive", category: "Actinomycete", resistance: [], notes: "Brain/Lung abscess." },
  { id: "bacillus_anthracis", name: "Bacillus anthracis", type: "gram-positive", category: "Rod", resistance: [], notes: "Bioterrorism agent." },

  // FUNGI & OTHERS
  { id: "candida_albicans", name: "Candida albicans", type: "fungus", category: "Yeast", resistance: ["Azole (emerging)"], notes: "Common candidemia." },
  { id: "candida_glabrata", name: "Candida glabrata", type: "fungus", category: "Yeast", resistance: ["Fluconazole"], notes: "Dose-dependent susceptibility." },
  { id: "candida_krusei", name: "Candida krusei", type: "fungus", category: "Yeast", resistance: ["Intrinsic Fluconazole"], notes: "Use Echinocandins." },
  { id: "aspergillus_fumigatus", name: "Aspergillus fumigatus", type: "fungus", category: "Mold", resistance: ["Azole"], notes: "Transplant/Neutropenia risk." },
  { id: "pneumocystis_jirovecii", name: "Pneumocystis jirovecii", type: "fungus", category: "Opportunistic", resistance: [], notes: "HIV/Transplant." },
  { id: "cryptococcus_neoformans", name: "Cryptococcus neoformans", type: "fungus", category: "Yeast", resistance: [], notes: "Meningitis in HIV." },
  { id: "histoplasma_capsulatum", name: "Histoplasma capsulatum", type: "fungus", category: "Dimorphic", resistance: [], notes: "Endemic in Ohio River Valley." },
  { id: "mucor_species", name: "Mucor species", type: "fungus", category: "Mold", resistance: [], notes: "Surgical emergency." },
  
  { id: "borrelia_burgdorferi", name: "Borrelia burgdorferi", type: "spirochete", category: "Tick-borne", resistance: [], notes: "Lyme disease." },
  { id: "toxoplasma_gondii", name: "Toxoplasma gondii", type: "parasite", category: "Protozoa", resistance: [], notes: "CNS lesions in HIV." }
];

// --- ANTIBIOTICS (Verified & Expanded) ---
const ANTIBIOTICS = [
  // PENICILLINS
  { id: "penicillin_g", name: "Penicillin G", class: "Natural Penicillin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Drug of choice for syphilis." },
  { id: "penicillin_vk", name: "Penicillin VK", class: "Natural Penicillin", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Oral option for strep pharyngitis." },
  { id: "ampicillin", name: "Ampicillin", class: "Aminopenicillin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Drug of choice for Listeria." },
  { id: "amoxicillin", name: "Amoxicillin", class: "Aminopenicillin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Oral only. Better absorption." },
  { id: "amoxicillin_clavulanate", name: "Amox-Clav", class: "Penicillin/BLI", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "GI side effects common." },
  { id: "ampicillin_sulbactam", name: "Amp-Sulbactam", class: "Penicillin/BLI", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Good for Acinetobacter." },
  { id: "nafcillin", name: "Nafcillin", class: "Anti-Staph Penicillin", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Hepatic metabolism. MSSA only." },
  { id: "oxacillin", name: "Oxacillin", class: "Anti-Staph Penicillin", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Used for susceptibility testing." },
  { id: "dicloxacillin", name: "Dicloxacillin", class: "Anti-Staph Penicillin", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Oral option for MSSA." },
  { id: "piperacillin_tazobactam", name: "Pip-Tazo", class: "Penicillin/BLI", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Broad gram-negative/anaerobe/Pseudo coverage." },
  { id: "ticarcillin_clavulanate", name: "Ticar-Clav", class: "Penicillin/BLI", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "High sodium load. Limited use." },

  // CEPHALOSPORINS
  { id: "cefazolin", name: "Cefazolin", class: "1st Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Surgical prophylaxis DOC." },
  { id: "cephalexin", name: "Cephalexin", class: "1st Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Oral MSSA/Strep." },
  { id: "cefadroxil", name: "Cefadroxil", class: "1st Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Once/twice daily oral." },
  { id: "cefuroxime", name: "Cefuroxime", class: "2nd Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Good for respiratory infections." },
  { id: "cefoxitin", name: "Cefoxitin", class: "2nd Gen (Cephamycin)", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Anaerobic coverage." },
  { id: "cefotetan", name: "Cefotetan", class: "2nd Gen (Cephamycin)", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Long half-life. MTT side chain." },
  { id: "ceftriaxone", name: "Ceftriaxone", class: "3rd Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "No Pseudomonas. CNS penetration." },
  { id: "cefotaxime", name: "Cefotaxime", class: "3rd Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Preferred in neonates." },
  { id: "ceftazidime", name: "Ceftazidime", class: "3rd Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Pseudomonas coverage. Poor Gram+." },
  { id: "cefdinir", name: "Cefdinir", class: "3rd Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Oral pediatric option." },
  { id: "cefixime", name: "Cefixime", class: "3rd Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Oral option for Gonorrhea." },
  { id: "cefpodoxime", name: "Cefpodoxime", class: "3rd Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Oral option." },
  { id: "cefepime", name: "Cefepime", class: "4th Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Neurotoxicity in renal failure." },
  { id: "ceftaroline", name: "Ceftaroline", class: "5th Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "MRSA coverage." },
  { id: "ceftobiprole", name: "Ceftobiprole", class: "5th Gen Cephalosporin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: false, pregnancy: "Caution", notes: "Not FDA approved yet." },
  { id: "ceftazidime_avibactam", name: "Caz-Avi", class: "Ceph/BLI", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "KPC coverage." },
  { id: "ceftolozane_tazobactam", name: "C/T", class: "Ceph/BLI", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "MDR Pseudomonas." },
  
  // CARBAPENEMS & MONOBACTAMS
  { id: "meropenem", name: "Meropenem", class: "Carbapenem", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Reserve for ESBL/MDR. Low seizure risk." },
  { id: "imipenem", name: "Imipenem-Cilastatin", class: "Carbapenem", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "Seizure risk." },
  { id: "ertapenem", name: "Ertapenem", class: "Carbapenem", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: false, pregnancy: "Safe", notes: "No Pseudomonas/Acinetobacter coverage." },
  { id: "doripenem", name: "Doripenem", class: "Carbapenem", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Similar to Meropenem." },
  { id: "meropenem_vaborbactam", name: "Mero-Vabor", class: "Carbapenem/BLI", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: false, pregnancy: "Caution", notes: "KPC coverage." },
  { id: "imipenem_relebactam", name: "Imi-Rele", class: "Carbapenem/BLI", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "Broad coverage." },
  { id: "aztreonam", name: "Aztreonam", class: "Monobactam", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Safe in PCN allergy. Gram-neg only." },
  { id: "aztreonam_avibactam", name: "Aztreonam-Avi", class: "Monobactam/BLI", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: false, pregnancy: "Caution", notes: "MBL coverage (Investigational)." },

  // GLYCOPEPTIDES & LIPOPEPTIDES
  { id: "vancomycin", name: "Vancomycin", class: "Glycopeptide", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "Monitor AUC/Trough. Nephrotoxic." },
  { id: "vancomycin_oral", name: "Vancomycin (PO)", class: "Glycopeptide", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "C. diff only. Not absorbed." },
  { id: "telavancin", name: "Telavancin", class: "Lipoglycopeptide", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: false, pregnancy: "Avoid", notes: "QTc prolongation." },
  { id: "dalbavancin", name: "Dalbavancin", class: "Lipoglycopeptide", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: false, pregnancy: "Caution", notes: "Weekly dosing." },
  { id: "oritavancin", name: "Oritavancin", class: "Lipoglycopeptide", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: false, pregnancy: "Caution", notes: "Single dose." },
  { id: "daptomycin", name: "Daptomycin", class: "Lipopeptide", mechanism: "Cell membrane depolarization", renal: true, pediatricSafe: false, pregnancy: "Caution", notes: "Inactivated by surfactant (No Pneumonia)." },
  
  // PROTEIN SYNTHESIS INHIBITORS
  { id: "linezolid", name: "Linezolid", class: "Oxazolidinone", mechanism: "Protein synthesis (50S)", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Serotonin syndrome. Myelosuppression >2wks." },
  { id: "tedizolid", name: "Tedizolid", class: "Oxazolidinone", mechanism: "Protein synthesis (50S)", renal: false, pediatricSafe: false, pregnancy: "Caution", notes: "Lower myelosuppression risk." },
  { id: "doxycycline", name: "Doxycycline", class: "Tetracycline", mechanism: "Protein synthesis (30S)", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "Tick-borne, MRSA, Atypicals." },
  { id: "minocycline", name: "Minocycline", class: "Tetracycline", mechanism: "Protein synthesis (30S)", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "Vestibular side effects." },
  { id: "tigecycline", name: "Tigecycline", class: "Glycylcycline", mechanism: "Protein synthesis (30S)", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "Low serum levels. Avoid bacteremia." },
  { id: "eravacycline", name: "Eravacycline", class: "Fluorocycline", mechanism: "Protein synthesis (30S)", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "Intra-abdominal infections." },
  { id: "omadacycline", name: "Omadacycline", class: "Aminomethylcycline", mechanism: "Protein synthesis (30S)", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "ABSSSI and CAP." },
  { id: "azithromycin", name: "Azithromycin", class: "Macrolide", mechanism: "Protein synthesis (50S)", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Anti-inflammatory. QT prolongation." },
  { id: "clarithromycin", name: "Clarithromycin", class: "Macrolide", mechanism: "Protein synthesis (50S)", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "Drug interactions (CYP3A4)." },
  { id: "erythromycin", name: "Erythromycin", class: "Macrolide", mechanism: "Protein synthesis (50S)", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "GI side effects." },
  { id: "fidaxomicin", name: "Fidaxomicin", class: "Macrocyclic", mechanism: "RNA polymerase", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "First line for C. diff." },
  { id: "clindamycin", name: "Clindamycin", class: "Lincosamide", mechanism: "Protein synthesis (50S)", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Highest C. diff risk. Toxin suppression." },
  { id: "gentamicin", name: "Gentamicin", class: "Aminoglycoside", mechanism: "Protein synthesis (30S)", renal: true, pediatricSafe: true, pregnancy: "Avoid", notes: "Nephro/Ototoxicity. Synergy." },
  { id: "tobramycin", name: "Tobramycin", class: "Aminoglycoside", mechanism: "Protein synthesis (30S)", renal: true, pediatricSafe: true, pregnancy: "Avoid", notes: "Preferred for Pseudomonas." },
  { id: "amikacin", name: "Amikacin", class: "Aminoglycoside", mechanism: "Protein synthesis (30S)", renal: true, pediatricSafe: true, pregnancy: "Avoid", notes: "Reserve agent." },
  { id: "plazomicin", name: "Plazomicin", class: "Aminoglycoside", mechanism: "Protein synthesis (30S)", renal: true, pediatricSafe: false, pregnancy: "Avoid", notes: "CRE coverage." },
  { id: "streptomycin", name: "Streptomycin", class: "Aminoglycoside", mechanism: "Protein synthesis (30S)", renal: true, pediatricSafe: true, pregnancy: "Avoid", notes: "TB and Brucella." },

  // QUINOLONES & OTHERS
  { id: "ciprofloxacin", name: "Ciprofloxacin", class: "Fluoroquinolone", mechanism: "DNA gyrase inhibition", renal: true, pediatricSafe: false, pregnancy: "Avoid", notes: "High collateral damage. Ohio E. coli resistance." },
  { id: "levofloxacin", name: "Levofloxacin", class: "Fluoroquinolone", mechanism: "DNA gyrase inhibition", renal: true, pediatricSafe: false, pregnancy: "Avoid", notes: "Respiratory quinolone." },
  { id: "moxifloxacin", name: "Moxifloxacin", class: "Fluoroquinolone", mechanism: "DNA gyrase inhibition", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "Anaerobic activity. No renal adjust." },
  { id: "delafloxacin", name: "Delafloxacin", class: "Fluoroquinolone", mechanism: "DNA gyrase inhibition", renal: true, pediatricSafe: false, pregnancy: "Avoid", notes: "MRSA coverage." },
  { id: "metronidazole", name: "Metronidazole", class: "Nitroimidazole", mechanism: "DNA damage", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Anaerobes only. Disulfiram reaction." },
  { id: "tinidazole", name: "Tinidazole", class: "Nitroimidazole", mechanism: "DNA damage", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "Parasitic infections." },
  { id: "nitrofurantoin", name: "Nitrofurantoin", class: "Nitrofuran", mechanism: "DNA damage", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Cystitis only. Avoid CrCl <30. Avoid at term." },
  { id: "tmp_smx", name: "TMP-SMX", class: "Folate Antagonist", mechanism: "Folate blockade", renal: true, pediatricSafe: true, pregnancy: "Avoid", notes: "Hyperkalemia risk. PCP/Listeria coverage." },
  { id: "sulfadiazine", name: "Sulfadiazine", class: "Sulfonamide", mechanism: "Folate synthesis", renal: true, pediatricSafe: true, pregnancy: "Avoid", notes: "Toxoplasmosis." },
  { id: "colistin", name: "Colistin", class: "Polymyxin", mechanism: "Membrane disruption", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "Nephrotoxic. Last resort." },
  { id: "polymyxin_b", name: "Polymyxin B", class: "Polymyxin", mechanism: "Membrane disruption", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Nephrotoxic." },
  { id: "rifampin", name: "Rifampin", class: "Rifamycin", mechanism: "RNA polymerase", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Biofilm active. CYP inducer." },
  { id: "rifabutin", name: "Rifabutin", class: "Rifamycin", mechanism: "RNA polymerase", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Less interactions than Rifampin." },
  { id: "rifaximin", name: "Rifaximin", class: "Rifamycin", mechanism: "RNA polymerase", renal: false, pediatricSafe: false, pregnancy: "Safe", notes: "Not absorbed. Travelers diarrhea." },
  { id: "fosfomycin", name: "Fosfomycin", class: "Fosfomycin", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: false, pregnancy: "Safe", notes: "Single dose UTI." },
  { id: "lefamulin", name: "Lefamulin", class: "Pleuromutilin", mechanism: "Protein synthesis (50S)", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "CAP only." },

  // ANTI-TUBERCULOSIS
  { id: "isoniazid", name: "Isoniazid", class: "Anti-TB", mechanism: "Mycolic acid synthesis", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Hepatotoxicity. Give B6." },
  { id: "pyrazinamide", name: "Pyrazinamide", class: "Anti-TB", mechanism: "Unknown", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "Hyperuricemia. Hepatotoxicity." },
  { id: "ethambutol", name: "Ethambutol", class: "Anti-TB", mechanism: "Cell wall synthesis", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Optic neuritis. Check vision." },
  { id: "bedaquiline", name: "Bedaquiline", class: "Anti-TB", mechanism: "ATP synthase", renal: false, pediatricSafe: false, pregnancy: "Caution", notes: "MDR-TB reserve. QT prolongation." },

  // ANTIFUNGALS & ANTIVIRALS
  { id: "fluconazole", name: "Fluconazole", class: "Azole", mechanism: "Ergosterol synthesis", renal: true, pediatricSafe: true, pregnancy: "Avoid", notes: "Candida/Crypto. Not C. krusei." },
  { id: "voriconazole", name: "Voriconazole", class: "Azole", mechanism: "Ergosterol synthesis", renal: false, pediatricSafe: true, pregnancy: "Avoid", notes: "Aspergillus DOC. Visual changes." },
  { id: "posaconazole", name: "Posaconazole", class: "Azole", mechanism: "Ergosterol synthesis", renal: false, pediatricSafe: true, pregnancy: "Avoid", notes: "Prophylaxis in neutropenia." },
  { id: "isavuconazole", name: "Isavuconazole", class: "Azole", mechanism: "Ergosterol synthesis", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "Fewer side effects than Vori." },
  { id: "itraconazole", name: "Itraconazole", class: "Azole", mechanism: "Ergosterol synthesis", renal: false, pediatricSafe: true, pregnancy: "Avoid", notes: "Absorption variable." },
  { id: "caspofungin", name: "Caspofungin", class: "Echinocandin", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Candida/Aspergillus." },
  { id: "micafungin", name: "Micafungin", class: "Echinocandin", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "HSCT prophylaxis." },
  { id: "anidulafungin", name: "Anidulafungin", class: "Echinocandin", mechanism: "Cell wall synthesis", renal: false, pediatricSafe: false, pregnancy: "Caution", notes: "No adjustments." },
  { id: "amphotericin_b", name: "Amphotericin B", class: "Polyene", mechanism: "Membrane disruption", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Broad spectrum. Nephrotoxic." },
  { id: "nystatin", name: "Nystatin", class: "Polyene", mechanism: "Membrane disruption", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Topical/Oral only." },
  { id: "flucytosine", name: "Flucytosine", class: "Pyrimidine", mechanism: "DNA/RNA synthesis", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "Bone marrow suppression." },
  { id: "griseofulvin", name: "Griseofulvin", class: "Antifungal", mechanism: "Microtubule disruption", renal: false, pediatricSafe: true, pregnancy: "Avoid", notes: "Tinea infections." },
  { id: "terbinafine", name: "Terbinafine", class: "Allylamine", mechanism: "Squalene epoxidase", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "Onychomycosis." },

  // ANTIVIRALS
  { id: "acyclovir", name: "Acyclovir", class: "Antiviral", mechanism: "DNA polymerase", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "HSV/VZV. Crystal nephropathy." },
  { id: "valacyclovir", name: "Valacyclovir", class: "Antiviral", mechanism: "DNA polymerase", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Prodrug of Acyclovir." },
  { id: "famciclovir", name: "Famciclovir", class: "Antiviral", mechanism: "DNA polymerase", renal: true, pediatricSafe: false, pregnancy: "Safe", notes: "Prodrug of Penciclovir." },
  { id: "ganciclovir", name: "Ganciclovir", class: "Antiviral", mechanism: "DNA polymerase", renal: true, pediatricSafe: false, pregnancy: "Avoid", notes: "CMV. Bone marrow suppression." },
  { id: "valganciclovir", name: "Valganciclovir", class: "Antiviral", mechanism: "DNA polymerase", renal: true, pediatricSafe: false, pregnancy: "Avoid", notes: "Oral prodrug." },
  { id: "foscarnet", name: "Foscarnet", class: "Antiviral", mechanism: "DNA polymerase", renal: true, pediatricSafe: false, pregnancy: "Caution", notes: "Nephrotoxic. Electrolyte issues." },
  { id: "cidofovir", name: "Cidofovir", class: "Antiviral", mechanism: "DNA polymerase", renal: true, pediatricSafe: false, pregnancy: "Avoid", notes: "Severe nephrotoxicity. Use probenecid." },
  { id: "oseltamivir", name: "Oseltamivir", class: "Antiviral", mechanism: "Neuraminidase", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Influenza." },
  { id: "zanamivir", name: "Zanamivir", class: "Antiviral", mechanism: "Neuraminidase", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Inhaled. Bronchospasm risk." },
  { id: "peramivir", name: "Peramivir", class: "Antiviral", mechanism: "Neuraminidase", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Single IV dose." },
  { id: "baloxavir", name: "Baloxavir", class: "Antiviral", mechanism: "Endonuclease", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Single oral dose." },
  { id: "emtricitabine_tenofovir", name: "Emtricitabine/Tenofovir", class: "Antiviral", mechanism: "NRTI", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "HIV PrEP/Tx." },
  { id: "dolutegravir", name: "Dolutegravir", class: "Antiviral", mechanism: "Integrase Inhibitor", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "High barrier to resistance." },

  // ANTIPARASITICS
  { id: "pyrimethamine", name: "Pyrimethamine", class: "Antiparasitic", mechanism: "Folate antagonist", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Toxoplasmosis." },
  { id: "atovaquone", name: "Atovaquone", class: "Antiparasitic", mechanism: "Mitochondrial inhibitor", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "PJP, Babesia." },
  { id: "pentamidine", name: "Pentamidine", class: "Antiparasitic", mechanism: "Multiple", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "PJP. Hypoglycemia risk." },
  { id: "artemether_lumefantrine", name: "Artemether-Lumefantrine", class: "Antimalarial", mechanism: "Heme polymerization", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "First-line Malaria." },
  { id: "atovaquone_proguanil", name: "Atovaquone-Proguanil", class: "Antimalarial", mechanism: "Multiple", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "Malaria Tx/Prophylaxis." },
  { id: "chloroquine", name: "Chloroquine", class: "Antimalarial", mechanism: "Heme polymerization", renal: true, pediatricSafe: true, pregnancy: "Safe", notes: "Check resistance." },
  { id: "mefloquine", name: "Mefloquine", class: "Antimalarial", mechanism: "Unknown", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Neuropsych side effects." },
  { id: "primaquine", name: "Primaquine", class: "Antimalarial", mechanism: "Unknown", renal: false, pediatricSafe: false, pregnancy: "Avoid", notes: "Check G6PD." },
  { id: "quinine", name: "Quinine", class: "Antimalarial", mechanism: "Heme polymerization", renal: true, pediatricSafe: true, pregnancy: "Caution", notes: "Cinchonism." },
  { id: "artesunate", name: "Artesunate", class: "Antimalarial", mechanism: "Heme alkylation", renal: false, pediatricSafe: true, pregnancy: "Caution", notes: "Severe malaria (IV)." },
  { id: "ivermectin", name: "Ivermectin", class: "Antiparasitic", mechanism: "Chloride channel", renal: false, pediatricSafe: true, pregnancy: "Avoid", notes: "Strongyloides/Scabies." },
  { id: "albendazole", name: "Albendazole", class: "Antiparasitic", mechanism: "Microtubule", renal: false, pediatricSafe: true, pregnancy: "Avoid", notes: "Helminths." },
  { id: "praziquantel", name: "Praziquantel", class: "Antiparasitic", mechanism: "Calcium influx", renal: false, pediatricSafe: true, pregnancy: "Safe", notes: "Schistosomiasis." }
];

// --- INFECTIONS ---
const INFECTIONS = [
  // RESPIRATORY
  {
    id: "cap",
    name: "Community Acquired Pneumonia",
    system: "Respiratory",
    severity: "moderate",
    common: ["Strep pneumo", "H. flu", "Atypicals"],
    standard: { first: "Ceftriaxone + Azithromycin", alt: "Levofloxacin", dur: "5-7d" },
    icu: { first: "Cefepime + Vancomycin + Azithromycin", warning: "Cover MRSA/Pseudomonas" },
    peds: { first: "High-dose Amoxicillin", warning: "Vaccine status?" },
    notes: "Assess for aspiration risk."
  },
  {
    id: "vap",
    name: "Ventilator-Associated Pneumonia",
    system: "Respiratory",
    severity: "severe",
    common: ["Pseudomonas", "Acinetobacter", "MRSA"],
    standard: { first: "Cefepime + Vancomycin", alt: "Meropenem + Linezolid", dur: "7-14d" },
    icu: { first: "Cefepime + Vancomycin", warning: "Daily de-escalation check" },
    notes: "Requires positive culture from BAL/Mini-BAL."
  },
  {
    id: "legionella",
    name: "Legionella Pneumonia",
    system: "Respiratory",
    severity: "severe",
    common: ["Legionella pneumophila"],
    standard: { first: "Azithromycin", alt: "Levofloxacin", dur: "7-14d" },
    reportable: true,
    notes: "Urinary antigen test available."
  },
  {
    id: "pcp",
    name: "Pneumocystis Pneumonia (PJP)",
    system: "Respiratory",
    severity: "severe",
    common: ["Pneumocystis jirovecii"],
    standard: { first: "TMP-SMX High Dose", alt: "Primaquine + Clindamycin", dur: "21d" },
    notes: "Add steroids if PaO2 < 70 mmHg.",
    immunocompromised: { warning: "Life threatening in HIV/Transplant" }
  },
  {
    id: "histoplasmosis",
    name: "Histoplasmosis",
    system: "Respiratory",
    severity: "moderate",
    common: ["Histoplasma capsulatum"],
    standard: { first: "Itraconazole", alt: "Amphotericin B (Severe)", dur: "6-12wks" },
    notes: "Ohio River Valley endemic.",
    reportable: false 
  },
  {
    id: "tb",
    name: "Pulmonary Tuberculosis",
    system: "Respiratory",
    severity: "severe",
    common: ["Mycobacterium tuberculosis"],
    standard: { first: "RIPE (Rif+Iso+Pyr+Eth)", alt: "Consult ID", dur: "6mo+" },
    reportable: true,
    publicHealth: { warning: "Airborne Isolation & DOT required" }
  },
  {
    id: "anthrax",
    name: "Inhalational Anthrax",
    system: "Respiratory",
    severity: "severe",
    common: ["Bacillus anthracis"],
    standard: { first: "Ciprofloxacin + Meropenem + Linezolid", dur: "60d" },
    reportable: true,
    notes: "Bioterrorism concern. Antitoxin needed."
  },

  // CNS
  {
    id: "meningitis",
    name: "Bacterial Meningitis",
    system: "CNS",
    severity: "severe",
    common: ["Strep pneumo", "N. meningitidis", "Listeria"],
    standard: { first: "Ceftriaxone + Vancomycin + Ampicillin", alt: "Meropenem + Vancomycin", dur: "10-14d" },
    icu: { warning: "Give steroids before antibiotics" },
    reportable: true,
    notes: "Ampicillin covers Listeria (Age >50 or IC)."
  },
  {
    id: "brain_abscess",
    name: "Brain Abscess",
    system: "CNS",
    severity: "severe",
    common: ["Streptococci", "Anaerobes", "S. aureus"],
    standard: { first: "Ceftriaxone + Metronidazole", alt: "Meropenem", dur: "4-8wks" },
    icu: { warning: "Neurosurgery consult mandatory" }
  },
  {
    id: "vp_shunt",
    name: "VP Shunt Infection",
    system: "CNS",
    severity: "severe",
    common: ["Staph epidermidis"],
    standard: { first: "Vancomycin + Cefepime", alt: "Meropenem", dur: "14-21d" }
  },
  {
    id: "crypto_meningitis",
    name: "Cryptococcal Meningitis",
    system: "CNS",
    severity: "severe",
    common: ["Cryptococcus neoformans"],
    standard: { first: "Amphotericin B + Flucytosine", dur: "Induction 2wks" },
    hiv: { warning: "Manage ICP with LPs" }
  },
  {
    id: "toxo",
    name: "CNS Toxoplasmosis",
    system: "CNS",
    severity: "severe",
    common: ["Toxoplasma gondii"],
    standard: { first: "Pyrimethamine + Sulfadiazine", dur: "6wks" },
    hiv: { warning: "Ring enhancing lesions on MRI" }
  },

  // GENITOURINARY
  {
    id: "uti_simple",
    name: "Uncomplicated Cystitis",
    system: "Genitourinary",
    severity: "mild",
    common: ["E. coli", "Klebsiella"],
    standard: { first: "Nitrofurantoin", alt: "TMP-SMX", dur: "5d" },
    pregnancy: { first: "Cephalexin or Nitrofurantoin", warning: "Avoid Fluoroquinolones" },
    notes: "Avoid Nitrofurantoin if CrCl < 30."
  },
  {
    id: "uti_complicated",
    name: "Complicated UTI/Pyelo",
    system: "Genitourinary",
    severity: "moderate",
    common: ["E. coli", "Pseudomonas", "Enterococcus"],
    standard: { first: "Cefepime", alt: "Pip-Tazo", dur: "7-14d" },
    icu: { first: "Cefepime", warning: "Cover Pseudomonas" },
    transplant: { first: "Meropenem", warning: "High ESBL risk" },
    notes: "Ohio E. coli has high Cipro resistance."
  },
  {
    id: "cauti",
    name: "Catheter-Associated UTI",
    system: "Genitourinary",
    severity: "moderate",
    common: ["E. coli", "Pseudomonas", "Candida"],
    standard: { first: "Cefepime", alt: "Pip-Tazo", dur: "7d" },
    notes: "Remove catheter if possible."
  },
  {
    id: "prostatitis",
    name: "Acute Bacterial Prostatitis",
    system: "Genitourinary",
    severity: "moderate",
    common: ["Enterobacterales"],
    standard: { first: "Ciprofloxacin", alt: "TMP-SMX", dur: "14-28d" },
    notes: "Requires prolonged therapy for penetration."
  },
  {
    id: "pyelonephritis",
    name: "Acute Pyelonephritis",
    system: "Genitourinary",
    severity: "moderate",
    common: ["E. coli"],
    standard: { first: "Ceftriaxone", alt: "Ciprofloxacin", dur: "7-14d" }
  },
  {
    id: "esbl_uti",
    name: "ESBL-producing UTI",
    system: "Genitourinary",
    severity: "severe",
    common: ["E. coli (ESBL)"],
    standard: { first: "Ertapenem", alt: "Meropenem", dur: "7-14d" }
  },

  // BLOODSTREAM / CARDIO
  {
    id: "sepsis",
    name: "Sepsis (Unknown Source)",
    system: "Systemic",
    severity: "severe",
    common: ["Staph", "E. coli", "Pseudomonas"],
    standard: { first: "Pip-Tazo + Vancomycin", alt: "Meropenem + Linezolid", dur: "7-10d" },
    icu: { warning: "Antibiotics within 1 hour" },
    transplant: { first: "Meropenem + Vancomycin" }
  },
  {
    id: "endocarditis_native",
    name: "Native Valve Endocarditis",
    system: "Cardiovascular",
    severity: "severe",
    common: ["S. aureus", "Viridans Strep"],
    standard: { first: "Vancomycin + Ceftriaxone", alt: "Daptomycin", dur: "4-6wks" },
    icu: { warning: "Echocardiography required" }
  },
  {
    id: "endocarditis_prosthetic",
    name: "Prosthetic Valve Endocarditis",
    system: "Cardiovascular",
    severity: "severe",
    common: ["Coag-neg Staph", "S. aureus"],
    standard: { first: "Vancomycin + Rifampin + Gentamicin", dur: "6wks" },
    notes: "Rifampin for biofilm penetration."
  },
  {
    id: "clabsi",
    name: "CLABSI",
    system: "Bloodstream",
    severity: "severe",
    common: ["Coag-neg Staph", "S. aureus", "Candida"],
    standard: { first: "Vancomycin + Cefepime", alt: "Linezolid", dur: "14d" },
    icu: { warning: "Pull the line!" }
  },
  {
    id: "vre_bacteremia",
    name: "VRE Bacteremia",
    system: "Bloodstream",
    severity: "severe",
    common: ["Enterococcus faecium VRE"],
    standard: { first: "Linezolid", alt: "Daptomycin", dur: "14-28d" }
  },
  {
    id: "neutropenia",
    name: "Febrile Neutropenia",
    system: "Systemic",
    severity: "severe",
    common: ["Pseudomonas", "Enterobacterales"],
    standard: { first: "Cefepime", alt: "Meropenem", dur: "Until counts recover" },
    oncology: { warning: "Emergent antibiotics (<60 min)" }
  },

  // SKIN & SOFT TISSUE
  {
    id: "cellulitis",
    name: "Cellulitis",
    system: "Skin",
    severity: "mild",
    common: ["Strep pyogenes", "Staph aureus"],
    standard: { first: "Cephalexin", alt: "Clindamycin", dur: "5-7d" }
  },
  {
    id: "abscess",
    name: "Purulent Abscess",
    system: "Skin",
    severity: "mild",
    common: ["MRSA"],
    standard: { first: "TMP-SMX", alt: "Doxycycline", dur: "5-10d" },
    notes: "I&D alone sufficient for small abscesses."
  },
  {
    id: "necrotizing_fasciitis",
    name: "Necrotizing Fasciitis",
    system: "Skin",
    severity: "severe",
    common: ["Polymicrobial", "Group A Strep"],
    standard: { first: "Pip-Tazo + Vancomycin + Clindamycin", alt: "Meropenem + Linezolid", dur: "Surgical" },
    icu: { warning: "Immediate Surgical Debridement" },
    notes: "Clindamycin suppresses toxin production."
  },
  {
    id: "diabetic_foot",
    name: "Diabetic Foot Infection",
    system: "Skin",
    severity: "severe",
    common: ["Polymicrobial", "Pseudomonas"],
    standard: { first: "Pip-Tazo + Vancomycin", alt: "Meropenem", dur: "14-28d" },
    notes: "Evaluate for osteomyelitis."
  },
  {
    id: "burn_wound",
    name: "Burn Wound Infection",
    system: "Skin",
    severity: "severe",
    common: ["Pseudomonas"],
    standard: { first: "Cefepime + Vancomycin", alt: "Meropenem", dur: "7-14d" }
  },

  // BONE & JOINT
  {
    id: "osteo_native",
    name: "Osteomyelitis (Native)",
    system: "Musculoskeletal",
    severity: "severe",
    common: ["S. aureus"],
    standard: { first: "Vancomycin", alt: "Daptomycin", dur: "42-56d" },
    notes: "Bone biopsy preferred over swab."
  },
  {
    id: "septic_arthritis",
    name: "Septic Arthritis",
    system: "Musculoskeletal",
    severity: "severe",
    common: ["S. aureus", "Gonorrhea"],
    standard: { first: "Vancomycin", alt: "Cefazolin", dur: "14-28d" }
  },
  {
    id: "prosthetic_joint",
    name: "Prosthetic Joint Infection",
    system: "Musculoskeletal",
    severity: "severe",
    common: ["Staph epidermidis"],
    standard: { first: "Vancomycin", alt: "Daptomycin", dur: "42-56d" }
  },

  // ABDOMINAL
  {
    id: "ia_complicated",
    name: "Complicated Intra-abdominal",
    system: "Gastrointestinal",
    severity: "severe",
    common: ["E. coli", "Bacteroides", "Streptococci"],
    standard: { first: "Pip-Tazo", alt: "Cefepime + Metronidazole", dur: "4-7d" },
    notes: "Source control (drainage) is key."
  },
  {
    id: "cdiff",
    name: "C. difficile Infection",
    system: "Gastrointestinal",
    severity: "moderate",
    common: ["C. difficile"],
    standard: { first: "Oral Vancomycin", alt: "Fidaxomicin", dur: "10d" }
  },
  {
    id: "cdiff_fulminant",
    name: "C. difficile (Fulminant)",
    system: "Gastrointestinal",
    severity: "severe",
    common: ["C. difficile"],
    standard: { first: "Oral Vancomycin + IV Metronidazole", dur: "14-21d" },
    icu: { warning: "Surgical consult if toxic megacolon" }
  },
  {
    id: "cholangitis",
    name: "Acute Cholangitis",
    system: "Gastrointestinal",
    severity: "severe",
    common: ["E. coli"],
    standard: { first: "Pip-Tazo", alt: "Ceftriaxone + Metronidazole", dur: "4-7d" }
  },
  {
    id: "pancreatitis_infected",
    name: "Infected Pancreatic Necrosis",
    system: "Gastrointestinal",
    severity: "severe",
    common: ["E. coli"],
    standard: { first: "Meropenem", alt: "Pip-Tazo", dur: "14-28d" }
  },
  {
    id: "giardia",
    name: "Giardiasis",
    system: "Gastrointestinal",
    severity: "mild",
    common: ["Giardia lamblia"],
    standard: { first: "Metronidazole", dur: "5-7d" }
  },
  
  // ENT
  {
    id: "otitis_media",
    name: "Acute Otitis Media",
    system: "ENT",
    severity: "mild",
    common: ["Strep pneumo", "H. flu", "Moraxella"],
    standard: { first: "Amoxicillin", alt: "Amox-Clav", dur: "7-10d" },
    peds: { warning: "Weight-based dosing" }
  },
  {
    id: "sinusitis",
    name: "Acute Bacterial Sinusitis",
    system: "ENT",
    severity: "mild",
    common: ["Strep pneumo", "H. flu"],
    standard: { first: "Amox-Clav", alt: "Levofloxacin", dur: "10-14d" }
  },
  {
    id: "peritonsillar_abscess",
    name: "Peritonsillar Abscess",
    system: "ENT",
    severity: "moderate",
    common: ["Strep pyogenes"],
    standard: { first: "Ampicillin-Sulbactam", alt: "Clindamycin", dur: "10-14d" }
  },
  {
    id: "odontogenic",
    name: "Odontogenic Infection",
    system: "ENT",
    severity: "moderate",
    common: ["Strep pyogenes", "Anaerobes"],
    standard: { first: "Amox-Clav", alt: "Clindamycin", dur: "5-10d" }
  },

  // SPECIAL / OTHER
  {
    id: "lyme",
    name: "Lyme Disease",
    system: "Tick-borne",
    severity: "mild",
    common: ["Borrelia burgdorferi"],
    standard: { first: "Doxycycline", alt: "Amoxicillin", dur: "14-21d" },
    notes: "Rising incidence in Ohio."
  },
  {
    id: "pid",
    name: "Pelvic Inflammatory Disease",
    system: "Reproductive",
    severity: "moderate",
    common: ["Gonorrhea", "Chlamydia"],
    standard: { first: "Ceftriaxone + Doxy + Metronidazole", dur: "14d" }
  },
  {
    id: "gonorrhea",
    name: "Gonorrhea",
    system: "Reproductive",
    severity: "mild",
    common: ["Neisseria gonorrhoeae"],
    standard: { first: "Ceftriaxone", dur: "1 dose" }
  },
  {
    id: "malaria",
    name: "Malaria",
    system: "Systemic",
    severity: "severe",
    common: ["Plasmodium falciparum"],
    standard: { first: "Artemether-Lumefantrine", alt: "Atovaquone-Proguanil" },
    reportable: true
  },
  {
    id: "opsi",
    name: "Post-Splenectomy Sepsis",
    system: "Systemic",
    severity: "severe",
    common: ["Encapsulated organisms"],
    standard: { first: "Ceftriaxone + Vancomycin", dur: "10-14d" },
    asplenic: { warning: "Medical Emergency" }
  },
  {
    id: "mucor",
    name: "Mucormycosis",
    system: "HEENT",
    severity: "severe",
    common: ["Mucorales"],
    standard: { first: "Liposomal Amphotericin B", dur: "Months" },
    notes: "Surgical Emergency."
  },
  {
    id: "hiv_pep",
    name: "HIV Post-Exposure Prophylaxis",
    system: "Systemic",
    severity: "moderate",
    common: ["HIV"],
    standard: { first: "Tenofovir/Emtricitabine + Dolutegravir", dur: "28d" },
    notes: "Start within 72h."
  }
];

// --- ANTIBIOGRAM DATA (Flattened) ---
const ANTIBIOGRAM_DATA = [
  { organism: "E. coli", drug: "Ampicillin", sus: 45 },
  { organism: "E. coli", drug: "Amox-Clav", sus: 78 },
  { organism: "E. coli", drug: "Ceftriaxone", sus: 82 },
  { organism: "E. coli", drug: "Cefepime", sus: 85 },
  { organism: "E. coli", drug: "Pip-Tazo", sus: 88 },
  { organism: "E. coli", drug: "Ertapenem", sus: 98 },
  { organism: "E. coli", drug: "Meropenem", sus: 99 },
  { organism: "E. coli", drug: "Ciprofloxacin", sus: 61 },
  { organism: "E. coli", drug: "Levofloxacin", sus: 64 },
  { organism: "E. coli", drug: "Nitrofurantoin", sus: 94 },
  { organism: "E. coli", drug: "TMP-SMX", sus: 68 },
  { organism: "E. coli", drug: "Gentamicin", sus: 89 },
  { organism: "E. coli", drug: "Amikacin", sus: 97 },
  { organism: "E. coli", drug: "Fosfomycin", sus: 96 },
  
  { organism: "Klebsiella pneu", drug: "Amox-Clav", sus: 72 },
  { organism: "Klebsiella pneu", drug: "Ceftriaxone", sus: 78 },
  { organism: "Klebsiella pneu", drug: "Cefepime", sus: 82 },
  { organism: "Klebsiella pneu", drug: "Ceftazidime", sus: 76 },
  { organism: "Klebsiella pneu", drug: "Pip-Tazo", sus: 85 },
  { organism: "Klebsiella pneu", drug: "Ertapenem", sus: 92 },
  { organism: "Klebsiella pneu", drug: "Meropenem", sus: 96 },
  { organism: "Klebsiella pneu", drug: "Cipro", sus: 65 },
  { organism: "Klebsiella pneu", drug: "Gentamicin", sus: 85 },
  { organism: "Klebsiella pneu", drug: "Tigecycline", sus: 94 },
  
  { organism: "P. aeruginosa", drug: "Cefepime", sus: 78 },
  { organism: "P. aeruginosa", drug: "Ceftazidime", sus: 74 },
  { organism: "P. aeruginosa", drug: "Pip-Tazo", sus: 74 },
  { organism: "P. aeruginosa", drug: "Meropenem", sus: 81 },
  { organism: "P. aeruginosa", drug: "Imipenem", sus: 76 },
  { organism: "P. aeruginosa", drug: "Aztreonam", sus: 72 },
  { organism: "P. aeruginosa", drug: "Ciprofloxacin", sus: 72 },
  { organism: "P. aeruginosa", drug: "Levofloxacin", sus: 70 },
  { organism: "P. aeruginosa", drug: "Tobramycin", sus: 82 },
  { organism: "P. aeruginosa", drug: "Amikacin", sus: 88 },
  { organism: "P. aeruginosa", drug: "Colistin", sus: 98 },
  
  { organism: "A. baumannii", drug: "Amp-Sulbactam", sus: 72 },
  { organism: "A. baumannii", drug: "Meropenem", sus: 48 },
  { organism: "A. baumannii", drug: "Tigecycline", sus: 82 },
  { organism: "A. baumannii", drug: "Colistin", sus: 95 },
  
  { organism: "Stenotrophomonas", drug: "TMP-SMX", sus: 95 },
  { organism: "Stenotrophomonas", drug: "Levofloxacin", sus: 78 },
  { organism: "Stenotrophomonas", drug: "Minocycline", sus: 88 },
  
  { organism: "S. aureus (MSSA)", drug: "Oxacillin", sus: 58 },
  { organism: "S. aureus", drug: "Cefazolin", sus: 58 },
  { organism: "S. aureus", drug: "Vancomycin", sus: 100 },
  { organism: "S. aureus", drug: "Daptomycin", sus: 100 },
  { organism: "S. aureus", drug: "Linezolid", sus: 100 },
  { organism: "S. aureus", drug: "Clindamycin", sus: 72 },
  { organism: "S. aureus", drug: "TMP-SMX", sus: 98 },
  { organism: "S. aureus", drug: "Doxycycline", sus: 95 },
  
  { organism: "S. epidermidis", drug: "Oxacillin", sus: 20 },
  { organism: "S. epidermidis", drug: "Vancomycin", sus: 100 },
  
  { organism: "S. pneumoniae", drug: "Penicillin", sus: 70 },
  { organism: "S. pneumoniae", drug: "Ceftriaxone", sus: 95 },
  { organism: "S. pneumoniae", drug: "Levofloxacin", sus: 99 },
  { organism: "S. pneumoniae", drug: "Vancomycin", sus: 100 },
  
  { organism: "E. faecalis", drug: "Ampicillin", sus: 92 },
  { organism: "E. faecalis", drug: "Vancomycin", sus: 95 },
  { organism: "E. faecalis", drug: "Linezolid", sus: 100 },
  
  { organism: "E. faecium", drug: "Ampicillin", sus: 10 },
  { organism: "E. faecium", drug: "Vancomycin", sus: 62 },
  { organism: "E. faecium", drug: "Linezolid", sus: 100 },
  { organism: "E. faecium", drug: "Daptomycin", sus: 98 },
  
  { organism: "H. influenzae", drug: "Ampicillin", sus: 70 },
  { organism: "H. influenzae", drug: "Amox-Clav", sus: 98 },
  { organism: "H. influenzae", drug: "Ceftriaxone", sus: 99 },
  
  { organism: "Moraxella cat", drug: "Amoxicillin", sus: 5 },
  { organism: "Moraxella cat", drug: "Amox-Clav", sus: 99 },
  
  { organism: "B. fragilis", drug: "Metronidazole", sus: 99 },
  { organism: "B. fragilis", drug: "Pip-Tazo", sus: 95 },
  { organism: "B. fragilis", drug: "Meropenem", sus: 99 },
  { organism: "B. fragilis", drug: "Clindamycin", sus: 70 },
  
  { organism: "Candida albicans", drug: "Fluconazole", sus: 95 },
  { organism: "Candida albicans", drug: "Micafungin", sus: 99 },
  
  { organism: "Candida glabrata", drug: "Fluconazole", sus: 85 },
  { organism: "Candida glabrata", drug: "Micafungin", sus: 97 },
  
  { organism: "Candida krusei", drug: "Fluconazole", sus: 0 },
  { organism: "Candida krusei", drug: "Voriconazole", sus: 88 },
  { organism: "Candida krusei", drug: "Micafungin", sus: 99 },
  
  { organism: "Aspergillus", drug: "Voriconazole", sus: 95 },
  { organism: "Aspergillus", drug: "Amphotericin B", sus: 90 }
];

// --- RENAL DOSING DATA (Complete) ---
const RENAL_DATA = {
  "Ampicillin": { normal: "1-2g q4-6h", moderate: "1-2g q6-8h", severe: "1-2g q12h", notes: "Increase interval with decreasing CrCl" },
  "Amoxicillin": { normal: "500-875mg q8-12h", moderate: "500mg q12h", severe: "250-500mg q24h", notes: "Dose after dialysis" },
  "Piperacillin-Tazobactam": { normal: "4.5g q6h (or q8h)", moderate: "3.375g q6h", severe: "2.25g q6-8h", notes: "Extended infusion preferred - dose after dialysis" },
  "Cefazolin": { normal: "1-2g q8h", moderate: "1-2g q12h", severe: "1-2g q24h", notes: "Dose after dialysis" },
  "Ceftriaxone": { normal: "1-2g q12-24h", moderate: "No adjustment", severe: "Max 2g/day", notes: "Dual renal and hepatic elimination - no adjustment unless both impaired" },
  "Cefepime": { normal: "1-2g q8-12h", moderate: "1-2g q12-24h", severe: "0.5-1g q24h", notes: "Neurotoxicity risk in renal failure - dose after dialysis" },
  "Ceftazidime": { normal: "2g q8h", moderate: "2g q12-24h", severe: "1g q24-48h", notes: "Dose after dialysis" },
  "Ceftazidime-Avibactam": { normal: "2.5g q8h", moderate: "1.25-2.5g q8-12h", severe: "0.94g q24-48h", notes: "Complex dosing - check product info" },
  "Ceftolozane-Tazobactam": { normal: "3g q8h", moderate: "1.5-3g q8h", severe: "750mg q8h", notes: "Dose after dialysis" },
  "Meropenem": { normal: "1-2g q8h", moderate: "1g q12h", severe: "500mg q12-24h", notes: "Dose reduction required - extended infusion for resistant organisms" },
  "Ertapenem": { normal: "1g q24h", moderate: "500mg q24h", severe: "500mg q24h", notes: "Once daily - outpatient OPAT option" },
  "Imipenem": { normal: "500mg q6h", moderate: "250-500mg q6-8h", severe: "250mg q12h", notes: "Do not use if CrCl <5 without RRT - seizure risk" },
  "Aztreonam": { normal: "1-2g q6-8h", moderate: "1-2g q8-12h", severe: "500mg-1g q12-24h", notes: "Dose after dialysis" },
  "Vancomycin": { normal: "15-20 mg/kg q8-12h", moderate: "Extended interval (q24-48h)", severe: "AUC-guided only", notes: "Monitor AUC/MIC - target AUC 400-600 - dose after dialysis - consider continuous infusion" },
  "Daptomycin": { normal: "6-10 mg/kg q24h", moderate: "6-10 mg/kg q48h", severe: "6-10 mg/kg q48h", notes: "Dose after dialysis - higher doses (8-10mg/kg) for endocarditis - CPK monitoring" },
  "Telavancin": { normal: "10 mg/kg q24h", moderate: "7.5 mg/kg q24h", severe: "10 mg/kg q48h", notes: "Complex dosing - avoid if CrCl <30" },
  "Dalbavancin": { normal: "1500mg x1", moderate: "750mg x1", severe: "750mg x1", notes: "Long half-life" },
  "Ciprofloxacin": { normal: "400mg IV q8-12h", moderate: "200-400mg q12-24h", severe: "200-400mg q24h", notes: "Dose after dialysis" },
  "Levofloxacin": { normal: "500-750mg q24h", moderate: "750mg load then 500mg q48h", severe: "750mg load then 250mg q48h", notes: "Loading dose regardless of function" },
  "Moxifloxacin": { normal: "400mg q24h", moderate: "No adjustment", severe: "No adjustment", notes: "Hepatic elimination" },
  "Gentamicin": { normal: "5-7 mg/kg q24h", moderate: "Extended interval", severe: "Monitor levels", notes: "Nephrotoxicity - therapeutic drug monitoring essential" },
  "Tobramycin": { normal: "5-7 mg/kg q24h", moderate: "Extended interval", severe: "Monitor levels", notes: "Similar to gentamicin" },
  "Amikacin": { normal: "15-20 mg/kg q24h", moderate: "Extended interval", severe: "Monitor levels", notes: "Monitor peak and trough levels" },
  "Plazomicin": { normal: "15 mg/kg q24h", moderate: "10 mg/kg q24h", severe: "Monitor levels", notes: "Next-generation aminoglycoside" },
  "Doxycycline": { normal: "100mg q12h", moderate: "No adjustment", severe: "No adjustment", notes: "Hepatic elimination" },
  "Minocycline": { normal: "200mg load then 100mg q12h", moderate: "No adjustment", severe: "No adjustment", notes: "No renal adjustment" },
  "Tigecycline": { normal: "100mg load then 50mg q12h", moderate: "No adjustment", severe: "No adjustment", notes: "No renal adjustment" },
  "Azithromycin": { normal: "500mg day 1 then 250mg", moderate: "No adjustment", severe: "Use with caution", notes: "Hepatic elimination" },
  "Clarithromycin": { normal: "500mg q12h", moderate: "250-500mg q12h", severe: "250mg q24h", notes: "Reduce dose by 50% if CrCl <30" },
  "Clindamycin": { normal: "600-900mg q8h", moderate: "No adjustment", severe: "No adjustment", notes: "Hepatic metabolism" },
  "Linezolid": { normal: "600mg q12h", moderate: "No adjustment", severe: "No adjustment", notes: "Dialyzable - dose after dialysis" },
  "Tedizolid": { normal: "200mg q24h", moderate: "No adjustment", severe: "No adjustment", notes: "No adjustment needed" },
  "TMP-SMX": { normal: "15-20mg/kg/day divided", moderate: "50% dose", severe: "Avoid or 5-10mg/kg", notes: "Hyperkalemia risk - avoid if CrCl <15" },
  "Metronidazole": { normal: "500mg q8h", moderate: "No adjustment", severe: "500mg q12h", notes: "Metabolites accumulate in renal failure" },
  "Nitrofurantoin": { normal: "100mg q12h", moderate: "Avoid if CrCl <30", severe: "Contraindicated", notes: "Ineffective in renal failure" },
  "Fosfomycin": { normal: "3g single dose", moderate: "3g single dose", severe: "Avoid if CrCl <30", notes: "Single dose" },
  "Rifampin": { normal: "600mg daily", moderate: "No adjustment", severe: "No adjustment", notes: "Hepatic elimination" },
  "Colistin": { normal: "2.5-5mg/kg/day", moderate: "See nomogram", severe: "See nomogram", notes: "Nephrotoxicity - monitoring recommended" },
  "Polymyxin B": { normal: "1.5-2.5mg/kg/day", moderate: "No adjustment", severe: "No adjustment", notes: "Less nephrotoxic than colistin" },
  "Fluconazole": { normal: "400-800mg daily", moderate: "50% dose", severe: "25-50% dose", notes: "Loading dose full, then adjust" },
  "Voriconazole": { normal: "4-6 mg/kg q12h", moderate: "Prefer PO", severe: "Prefer PO", notes: "IV vehicle accumulates if CrCl <50" },
  "Posaconazole": { normal: "300mg q12h day 1 then daily", moderate: "No adjustment", severe: "No adjustment", notes: "No renal adjustment" },
  "Isavuconazole": { normal: "372mg q8h x6 then daily", moderate: "No adjustment", severe: "No adjustment", notes: "No adjustment needed" },
  "Itraconazole": { normal: "200mg q12-24h", moderate: "No adjustment", severe: "Avoid IV", notes: "Oral no adjustment" },
  "Caspofungin": { normal: "70mg load then 50mg", moderate: "No adjustment", severe: "No adjustment", notes: "Hepatic dosing required" },
  "Micafungin": { normal: "100-150mg daily", moderate: "No adjustment", severe: "No adjustment", notes: "No adjustment needed" },
  "Anidulafungin": { normal: "200mg load then 100mg", moderate: "No adjustment", severe: "No adjustment", notes: "No adjustment needed" },
  "Amphotericin B": { normal: "0.5-1.5 mg/kg daily", moderate: "No adjustment", severe: "No adjustment", notes: "Nephrotoxic - monitor function" },
  "Flucytosine": { normal: "25mg/kg q6h", moderate: "q12-24h", severe: "q24-48h", notes: "Monitor levels" },
  "Acyclovir": { normal: "5-10 mg/kg q8h", moderate: "q12-24h", severe: "q24h", notes: "Hydration important" },
  "Valacyclovir": { normal: "1g q8h", moderate: "1g q12h", severe: "500mg q24h", notes: "Adjust same as acyclovir" },
  "Ganciclovir": { normal: "5 mg/kg q12h", moderate: "2.5mg/kg q24h", severe: "1.25mg/kg 3x/week", notes: "Complex dosing" },
  "Valganciclovir": { normal: "900mg q12h", moderate: "450mg q24h", severe: "450mg 2x/week", notes: "Adjust same as ganciclovir" },
  "Foscarnet": { normal: "90 mg/kg q12h", moderate: "See nomogram", severe: "See nomogram", notes: "Nephrotoxicity" },
  "Oseltamivir": { normal: "75mg q12h", moderate: "30-75mg daily", severe: "30mg daily", notes: "Dose reduction required" },
  "Chloroquine": { normal: "Standard", moderate: "50% dose", severe: "50% dose", notes: "Reduce in severe impairment" },
  "Atovaquone-Proguanil": { normal: "Standard", moderate: "Caution", severe: "Avoid", notes: "Contraindicated if CrCl <30" },
  "Primaquine": { normal: "30mg daily", moderate: "No adjustment", severe: "No adjustment", notes: "Caution in G6PD deficiency" },
  "Ethambutol": { normal: "15-25mg/kg daily", moderate: "15-25mg/kg 3x/wk", severe: "15-25mg/kg 2x/wk", notes: "Optic neuritis risk" },
  "Pyrazinamide": { normal: "25mg/kg daily", moderate: "25-35mg/kg 3x/wk", severe: "25-35mg/kg 2x/wk", notes: "Dose reduction" },
  "Isoniazid": { normal: "5mg/kg daily", moderate: "No adjustment", severe: "No adjustment", notes: "Give B6" },
  "Bedaquiline": { normal: "400mg daily x2w then 200mg 3x/w", moderate: "No adjustment", severe: "Caution", notes: "QT prolongation" }
};

/**
 * COMPONENTS
 */

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 backdrop-blur-md border ${
      active 
        ? 'bg-white/20 text-white border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-[1.02] ring-1 ring-white/50' 
        : 'text-cyan-100 border-transparent hover:bg-white/10 hover:border-white/20 hover:text-white hover:scale-[1.01]'
    }`}
  >
    <Icon size={20} className="drop-shadow-sm" />
    <span className="font-bold tracking-wide text-sm">{label}</span>
  </button>
);

const Glass3DCard = ({ children, className = "", onClick, noPadding = false, theme = "cyan" }) => {
  const themes = {
    cyan: "border-t-cyan-100/60 border-l-cyan-100/40 border-r-cyan-900/10 border-b-cyan-900/10 shadow-[8px_8px_16px_rgba(34,211,238,0.15),-4px_-4px_12px_rgba(255,255,255,0.6)] bg-gradient-to-br from-white/80 via-cyan-50/30 to-white/10",
    rose: "border-t-rose-100/60 border-l-rose-100/40 border-r-rose-900/10 border-b-rose-900/10 shadow-[8px_8px_16px_rgba(251,113,133,0.15),-4px_-4px_12px_rgba(255,255,255,0.6)] bg-gradient-to-br from-white/80 via-rose-50/30 to-white/10",
    indigo: "border-t-indigo-100/60 border-l-indigo-100/40 border-r-indigo-900/10 border-b-indigo-900/10 shadow-[8px_8px_16px_rgba(129,140,248,0.15),-4px_-4px_12px_rgba(255,255,255,0.6)] bg-gradient-to-br from-white/80 via-indigo-50/30 to-white/10",
    violet: "border-t-violet-100/60 border-l-violet-100/40 border-r-violet-900/10 border-b-violet-900/10 shadow-[8px_8px_16px_rgba(167,139,250,0.15),-4px_-4px_12px_rgba(255,255,255,0.6)] bg-gradient-to-br from-white/80 via-violet-50/30 to-white/10",
    amber: "border-t-amber-100/60 border-l-amber-100/40 border-r-amber-900/10 border-b-amber-900/10 shadow-[8px_8px_16px_rgba(251,191,36,0.15),-4px_-4px_12px_rgba(255,255,255,0.6)] bg-gradient-to-br from-white/80 via-amber-50/30 to-white/10",
    emerald: "border-t-emerald-100/60 border-l-emerald-100/40 border-r-emerald-900/10 border-b-emerald-900/10 shadow-[8px_8px_16px_rgba(52,211,153,0.15),-4px_-4px_12px_rgba(255,255,255,0.6)] bg-gradient-to-br from-white/80 via-emerald-50/30 to-white/10",
  };

  return (
    <div 
      onClick={onClick} 
      className={`
        relative overflow-hidden
        backdrop-blur-3xl backdrop-saturate-200 border-[1.5px]
        rounded-[2rem] transition-all duration-500 ease-out
        ${themes[theme] || themes.cyan}
        ${onClick ? 'cursor-pointer hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:brightness-110 active:scale-[0.98]' : ''}
        ${noPadding ? '' : 'p-6 md:p-8'}
        ${className}
      `}
    >
      {/* Volumetric Noise Texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none" />
      
      {/* Dynamic Sheen */}
      <div className="absolute -top-[150%] -left-[150%] w-[300%] h-[300%] bg-gradient-to-br from-transparent via-white/40 to-transparent rotate-45 transform translate-y-full transition-transform duration-1000 group-hover:translate-y-[-60%] pointer-events-none blur-xl" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Badge = ({ children, color = "blue", icon: Icon }) => {
  const colors = {
    blue: "bg-cyan-50/80 text-cyan-900 border-cyan-200 shadow-cyan-500/10",
    green: "bg-emerald-50/80 text-emerald-900 border-emerald-200 shadow-emerald-500/10",
    red: "bg-rose-50/80 text-rose-900 border-rose-200 shadow-rose-500/10",
    purple: "bg-violet-50/80 text-violet-900 border-violet-200 shadow-violet-500/10",
    orange: "bg-amber-50/80 text-amber-900 border-amber-200 shadow-amber-500/10",
    yellow: "bg-yellow-50/80 text-yellow-900 border-yellow-200 shadow-yellow-500/10",
    slate: "bg-slate-50/80 text-slate-900 border-slate-200 shadow-slate-500/10"
  };
  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border shadow-sm backdrop-blur-md uppercase tracking-widest transition-transform hover:scale-105 ${colors[color] || colors.blue}`}>
      {Icon && <Icon size={12} strokeWidth={3} />}
      <span>{children}</span>
    </span>
  );
};

// --- VIEWS ---

const DashboardView = ({ setView }) => (
  <div className="space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-700">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
      
      {/* Hero Card - The "Main Crystal" */}
      <div className="lg:col-span-8 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 text-white shadow-[0_30px_60px_-15px_rgba(6,182,212,0.5)] border-t border-l border-white/40 relative overflow-hidden group hover:shadow-[0_40px_80px_-15px_rgba(6,182,212,0.7)] transition-all duration-700">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-br from-cyan-300/30 to-purple-400/30 rounded-full blur-[120px] group-hover:blur-[140px] transition-all duration-1000 animate-pulse"></div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]">
                <Activity size={28} className="text-white drop-shadow-md" />
              </div>
              <span className="text-cyan-50 font-black tracking-[0.25em] text-xs uppercase drop-shadow-md border-b-2 border-white/20 pb-1">Clinical Decision Support</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-none drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-100">
              Antibiotic Atlas<br/>
              <span className="text-2xl md:text-4xl font-light text-cyan-200 mt-2 block tracking-tight">Central Ohio Region</span>
            </h2>
            <p className="text-cyan-50 text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed font-medium drop-shadow-md opacity-90">
              The definitive antimicrobial stewardship guide. Access evidence-based pathways, antibiograms, and dosing protocols instantly.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6 items-center">
            <button 
              onClick={() => setView('infections')}
              className="bg-white text-cyan-950 px-10 py-5 rounded-3xl font-black text-xl hover:bg-cyan-50 transition-all shadow-[0_15px_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.7)] hover:-translate-y-1 active:scale-95 flex items-center group/btn"
            >
              Start Guide <ArrowRight className="ml-3 w-6 h-6 group-hover/btn:translate-x-2 transition-transform" strokeWidth={3} />
            </button>
            <div className="flex items-center space-x-3 px-6 py-4 bg-indigo-950/30 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner">
              <CheckCircle size={24} className="text-emerald-400 drop-shadow-md" />
              <span className="text-sm font-bold tracking-wider text-indigo-50">v{METADATA.version} • Updated: {METADATA.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats/Quick Actions Column */}
      <div className="lg:col-span-4 space-y-6 flex flex-col">
        <Glass3DCard onClick={() => setView('antibiogram')} theme="violet" className="flex-1 group bg-gradient-to-br from-white/80 via-white/60 to-violet-100/40">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-violet-700 transition-colors drop-shadow-sm tracking-tight">Antibiogram</h3>
                  <p className="text-slate-500 text-sm mt-2 font-bold group-hover:text-slate-700 uppercase tracking-wider">Local susceptibility data</p>
               </div>
               <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-[1.2rem] text-white group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30 border border-white/20">
                 <Activity size={28} />
               </div>
            </div>
            <div className="mt-8 relative">
               <div className="flex justify-between text-xs mb-2 text-slate-500 font-bold uppercase tracking-widest">
                 <span>E. coli Susceptibility</span>
                 <span className="text-emerald-600 drop-shadow-sm text-sm">82%</span>
               </div>
               <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner border border-slate-300/50">
                 <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 w-[82%] h-full group-hover:animate-[pulse_2s_infinite] shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div>
               </div>
            </div>
          </div>
        </Glass3DCard>

        <Glass3DCard onClick={() => setView('microbes')} theme="cyan" className="flex-1 group bg-gradient-to-br from-white/80 via-white/60 to-cyan-100/40">
           <div className="flex justify-between items-center h-full">
              <div>
                <h3 className="text-2xl font-black text-slate-800 group-hover:text-cyan-700 transition-colors drop-shadow-sm tracking-tight">Microbes</h3>
                <p className="text-slate-500 text-sm mt-2 font-bold group-hover:text-slate-700 uppercase tracking-wider">Pathogen Encyclopedia</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-[1.2rem] text-white group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30 border border-white/20">
                 <Bug size={28} />
               </div>
           </div>
        </Glass3DCard>
      </div>
    </div>

    {/* Alert Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      <Glass3DCard theme="rose" className="border-l-[12px] border-l-rose-500 bg-gradient-to-r from-rose-50/60 to-white/90">
        <h3 className="font-black text-slate-900 mb-6 flex items-center text-xl drop-shadow-sm tracking-tight">
          <AlertTriangle className="text-rose-600 mr-3 drop-shadow-md filter drop-shadow-lg" fill="currentColor" fillOpacity={0.2} size={28} />
          Critical Regional Alerts
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start space-x-4 text-sm text-slate-800 bg-white/70 p-4 rounded-2xl border border-rose-200/60 shadow-sm hover:shadow-md transition-all hover:translate-x-1 duration-300 group">
            <div className="bg-rose-100 p-2 rounded-lg text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertOctagon size={18} />
            </div>
            <span className="leading-snug font-medium pt-1"><strong>Fluoroquinolones:</strong> Avoid for empiric UTI due to high local E. coli resistance (&gt;20%).</span>
          </li>
          <li className="flex items-start space-x-4 text-sm text-slate-800 bg-white/70 p-4 rounded-2xl border border-amber-200/60 shadow-sm hover:shadow-md transition-all hover:translate-x-1 duration-300 group">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Bug size={18} />
            </div>
            <span className="leading-snug font-medium pt-1"><strong>Lyme Disease:</strong> Increasing incidence in Central Ohio. Consider Doxycycline for rash.</span>
          </li>
        </ul>
      </Glass3DCard>

      <Glass3DCard theme="cyan" className="border-l-[12px] border-l-cyan-500 bg-gradient-to-r from-cyan-50/60 to-white/90">
         <h3 className="font-black text-slate-900 mb-6 flex items-center text-xl drop-shadow-sm tracking-tight">
          <Book className="text-cyan-600 mr-3 drop-shadow-md filter drop-shadow-lg" fill="currentColor" fillOpacity={0.2} size={28} />
          Formulary Updates
        </h3>
        <div className="space-y-4">
           <div className="flex items-center justify-between text-sm p-4 bg-white/70 hover:bg-white rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-lg border border-white/60 hover:scale-[1.02] duration-300 group">
             <span className="text-slate-800 font-extrabold text-base">Fidaxomicin</span>
             <Badge color="green" icon={CheckCircle}>Preferred</Badge>
           </div>
           <div className="flex items-center justify-between text-sm p-4 bg-white/70 hover:bg-white rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-lg border border-white/60 hover:scale-[1.02] duration-300 group">
             <span className="text-slate-800 font-extrabold text-base">Meropenem</span>
             <Badge color="yellow" icon={Shield}>Restricted</Badge>
           </div>
           <div className="flex items-center justify-between text-sm p-4 bg-white/70 hover:bg-white rounded-2xl transition-all cursor-pointer shadow-sm hover:shadow-lg border border-white/60 hover:scale-[1.02] duration-300 group">
             <span className="text-slate-800 font-extrabold text-base">Aminoglycosides</span>
             <Badge color="red" icon={AlertTriangle}>High Alert</Badge>
           </div>
        </div>
      </Glass3DCard>
    </div>
  </div>
);

const MicrobesView = ({ searchTerm }) => {
  const filtered = MICROBES.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMicrobeStyle = (type) => {
    switch(type) {
      case 'gram-negative':
        return {
          theme: 'rose',
          card: "bg-gradient-to-br from-white/90 via-rose-50/50 to-rose-100/30",
          icon: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/40 ring-4 ring-rose-100",
          badge: "bg-rose-100/80 text-rose-900 border-rose-300",
          title: "text-rose-950"
        };
      case 'gram-positive':
        return {
          theme: 'indigo',
          card: "bg-gradient-to-br from-white/90 via-indigo-50/50 to-blue-100/30",
          icon: "bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-100",
          badge: "bg-indigo-100/80 text-indigo-900 border-indigo-300",
          title: "text-indigo-950"
        };
      case 'fungus':
        return {
          theme: 'violet',
          card: "bg-gradient-to-br from-white/90 via-violet-50/50 to-purple-100/30",
          icon: "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/40 ring-4 ring-violet-100",
          badge: "bg-violet-100/80 text-violet-900 border-violet-300",
          title: "text-violet-950"
        };
      default:
        return {
          theme: 'amber',
          card: "bg-gradient-to-br from-white/90 via-amber-50/50 to-orange-100/30",
          icon: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/40 ring-4 ring-amber-100",
          badge: "bg-amber-100/80 text-amber-900 border-amber-300",
          title: "text-amber-950"
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-24 md:pb-0">
      {filtered.map((m, idx) => {
        const style = getMicrobeStyle(m.type);
        // Stagger animation based on index
        const delay = `${idx * 40}ms`;
        
        return (
          <div key={m.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards" style={{ animationDelay: delay }}>
            <Glass3DCard theme={style.theme} className={`group flex flex-col h-full ${style.card} hover:z-10`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-3xl ${style.icon} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner`}>
                  <Bug size={28} strokeWidth={2.5} />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${style.badge} shadow-sm`}>
                   {m.type === "fungus" ? "Fungus" : m.type === "parasite" ? "Parasite" : m.type === "spirochete" ? "Spirochete" : m.type}
                </span>
              </div>
              
              <h3 className={`text-3xl font-black mb-2 tracking-tight transition-colors duration-300 ${style.title}`}>{m.name}</h3>
              <p className="text-sm font-bold text-slate-500 italic mb-8">{m.category}</p>
              
              <div className="mt-auto space-y-4">
                {m.resistance.length > 0 && (
                  <div className="group/item flex items-start space-x-3 bg-white/40 p-4 rounded-2xl border border-white/40 hover:bg-white/70 transition-colors shadow-sm hover:scale-[1.02] duration-300">
                    <ShieldAlert size={20} className="mt-0.5 text-rose-600 flex-shrink-0 drop-shadow-sm group-hover/item:scale-110 transition-transform" />
                    <span className="text-slate-800 font-bold text-sm">Resist: <span className="font-medium text-slate-600">{m.resistance.join(", ")}</span></span>
                  </div>
                )}
                <div className="group/item flex items-start space-x-3 bg-white/40 p-4 rounded-2xl border border-white/40 hover:bg-white/70 transition-colors shadow-sm hover:scale-[1.02] duration-300">
                  <Info size={20} className="mt-0.5 text-cyan-600 flex-shrink-0 drop-shadow-sm group-hover/item:scale-110 transition-transform" />
                  <span className="font-bold text-slate-600 text-sm leading-relaxed">{m.notes}</span>
                </div>
              </div>
            </Glass3DCard>
          </div>
        );
      })}
    </div>
  );
};

const AntibioticsView = ({ searchTerm }) => {
  const filtered = ANTIBIOTICS.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDrugStyle = (drugClass) => {
    const lc = drugClass.toLowerCase();
    
    if (lc.includes('cephalosporin') || lc.includes('penicillin')) 
      return {
        theme: 'cyan',
        card: "bg-gradient-to-br from-white/95 via-cyan-50/40 to-cyan-100/10",
        badge: "bg-cyan-100 text-cyan-900 border-cyan-300",
        icon: "bg-cyan-100 text-cyan-700 border-cyan-200",
        title: "text-slate-900 group-hover:text-cyan-800"
      };
    if (lc.includes('carbapenem')) 
      return {
        theme: 'violet',
        card: "bg-gradient-to-br from-white/95 via-violet-50/30 to-violet-100/10",
        badge: "bg-violet-100 text-violet-900 border-violet-300",
        icon: "bg-violet-100 text-violet-700 border-violet-200",
        title: "text-slate-900 group-hover:text-violet-800"
      };
    if (lc.includes('glycopeptide') || lc.includes('oxazolidinone')) 
      return {
        theme: 'rose',
        card: "bg-gradient-to-br from-white/95 via-pink-50/30 to-pink-100/10",
        badge: "bg-pink-100 text-pink-900 border-pink-300",
        icon: "bg-pink-100 text-pink-700 border-pink-200",
        title: "text-slate-900 group-hover:text-pink-800"
      };
    if (lc.includes('fluoroquinolone') || lc.includes('tetracycline')) 
      return {
        theme: 'amber',
        card: "bg-gradient-to-br from-white/95 via-amber-50/30 to-amber-100/10",
        badge: "bg-amber-100 text-amber-900 border-amber-300",
        icon: "bg-amber-100 text-amber-700 border-amber-200",
        title: "text-slate-900 group-hover:text-amber-800"
      };
    
    return {
      theme: 'emerald',
      card: "bg-gradient-to-br from-white/95 via-emerald-50/30 to-emerald-100/10",
      badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
      icon: "bg-emerald-100 text-emerald-700 border-emerald-200",
      title: "text-slate-900 group-hover:text-emerald-800"
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-24 md:pb-0">
      {filtered.map((a, idx) => {
        const style = getDrugStyle(a.class);
        const delay = `${idx * 30}ms`;

        return (
        <div key={a.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards" style={{ animationDelay: delay }}>
          <Glass3DCard theme={style.theme} className={`group flex flex-col h-full ${style.card} hover:z-10`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-[1.2rem] shadow-inner border ${style.icon} group-hover:scale-110 transition-transform duration-300`}>
                <Pill size={32} strokeWidth={2.5} />
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${style.badge}`}>
                {a.class}
              </span>
            </div>
            
            <h3 className={`text-3xl font-black mb-3 transition-colors duration-300 drop-shadow-sm tracking-tight ${style.title}`}>{a.name}</h3>
            
            <div className="mb-8 flex items-center space-x-3 opacity-80 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Action</span>
               <div className="h-0.5 bg-slate-200 flex-1 rounded-full"></div>
               <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{a.mechanism}</span>
            </div>
            
            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between text-sm bg-white/60 p-4 rounded-2xl border border-white/60 shadow-inner group-hover:bg-white/80 transition-colors hover:scale-[1.02] duration-300">
                <span className="text-slate-500 flex items-center font-extrabold uppercase text-[10px] tracking-widest"><Activity size={16} className="mr-2 text-slate-400"/>Renal</span>
                <span className={`font-black px-3 py-1 rounded-lg text-[10px] uppercase tracking-wide border shadow-sm ${a.renal ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"}`}>
                  {a.renal ? "Required" : "None"}
                </span>
              </div>
              
              {/* Safety Badges - GAMIFIED */}
              <div className="flex gap-2">
                 {a.pediatricSafe && (
                  <div className="flex-1 flex items-center justify-center text-xs bg-cyan-50/60 p-3 rounded-2xl border border-cyan-100 shadow-sm text-cyan-800 font-bold group-hover:bg-cyan-100/60 transition-colors hover:scale-105 cursor-help" title="Safe for pediatric use">
                     <Baby size={16} className="mr-2 text-cyan-600"/> Peds Safe
                  </div>
                 )}
                 {a.pregnancy && (
                  <div className={`flex-1 flex items-center justify-center text-xs p-3 rounded-2xl border shadow-sm font-bold transition-colors hover:scale-105 cursor-help ${
                      a.pregnancy === 'Safe' ? 'bg-green-50/60 border-green-100 text-green-800 group-hover:bg-green-100/60' :
                      a.pregnancy === 'Caution' ? 'bg-amber-50/60 border-amber-100 text-amber-800 group-hover:bg-amber-100/60' :
                      'bg-rose-50/60 border-rose-100 text-rose-800 group-hover:bg-rose-100/60'
                  }`} title={`Pregnancy Risk: ${a.pregnancy}`}>
                     <Heart size={16} className="mr-2"/> Preg: {a.pregnancy}
                  </div>
                 )}
              </div>

              <div className="flex items-start space-x-3 text-sm p-4 bg-slate-50/40 rounded-2xl border border-slate-100/50 hover:bg-slate-50/60 transition-colors">
                <Info size={18} className="mt-0.5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-600 leading-relaxed font-bold text-xs">{a.notes}</span>
              </div>
            </div>
          </Glass3DCard>
        </div>
      )})}
    </div>
  );
};

const InfectionsView = ({ searchTerm, isTraineeMode, patientContext }) => {
  const filtered = INFECTIONS.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.system.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [revealedAnswers, setRevealedAnswers] = useState({});

  const toggleReveal = (id) => {
    setRevealedAnswers(prev => ({...prev, [id]: !prev[id]}));
  };

  const getRecommendation = (infection) => {
    if (patientContext === 'icu' && infection.icu) return { ...infection.icu, source: 'ICU Protocol' };
    if (patientContext === 'transplant' && infection.transplant) return { ...infection.transplant, source: 'Transplant Protocol' };
    if (patientContext === 'peds' && infection.peds) return { ...infection.peds, source: 'Pediatric Protocol' };
    if (patientContext === 'pregnancy' && infection.pregnancy) return { ...infection.pregnancy, source: 'Pregnancy Protocol' };
    if (patientContext === 'oncology' && infection.oncology) return { ...infection.oncology, source: 'Neutropenia Protocol' };
    if (patientContext === 'hiv' && infection.hiv) return { ...infection.hiv, source: 'HIV Protocol' };
    return { ...infection.standard, source: 'Standard' };
  };

  const getCardStyle = (source) => {
    if (source === 'Standard') {
      return {
        theme: 'cyan',
        gradient: "bg-gradient-to-br from-white/95 via-cyan-50/20 to-white/80",
        border: "border-l-[8px] border-l-cyan-500"
      };
    } else {
      return {
        theme: 'rose',
        gradient: "bg-gradient-to-br from-white/95 via-rose-50/20 to-white/80",
        border: "border-l-[8px] border-l-rose-500"
      };
    }
  };

  return (
    <div className="space-y-12 pb-24 md:pb-20">
      {filtered.map((infection, index) => {
        const rec = getRecommendation(infection);
        const isRevealed = revealedAnswers[infection.id];
        const style = getCardStyle(rec.source);
        const delay = `${index * 50}ms`;

        return (
          <div key={infection.id} className="snap-start scroll-mt-24 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards" style={{ animationDelay: delay }}>
            <Glass3DCard theme={style.theme} className={`
              ${style.border} transition-all duration-500 min-h-[300px] flex flex-col justify-between transform hover:scale-[1.01] hover:shadow-2xl hover:bg-white/95
              ${style.gradient}
            `}>
              
              {/* Header */}
              <div className="mb-8 relative">
                 <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge color="purple" icon={Activity}>{infection.system}</Badge>
                    {rec.source !== 'Standard' && <Badge color="orange" icon={AlertOctagon}>{rec.source}</Badge>}
                    {infection.reportable && <Badge color="red" icon={FileText}>Reportable</Badge>}
                    <span className={`ml-auto text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${
                        infection.severity === 'severe' ? 'bg-rose-100 text-rose-800 border-rose-200' : 
                        infection.severity === 'moderate' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                        'bg-green-100 text-green-800 border-green-200'
                    }`}>
                        {infection.severity}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tight drop-shadow-sm group-hover:text-cyan-900 transition-colors leading-tight">{infection.name}</h3>
                  
                  <div className="flex items-start space-x-3 text-slate-700 text-sm md:text-base bg-white/60 p-4 rounded-2xl inline-block border border-white/60 shadow-sm backdrop-blur-md">
                    <Bug size={20} className="mt-0.5 text-slate-400" />
                    <span><span className="font-extrabold text-slate-900 uppercase tracking-wide text-xs block mb-1">Pathogens</span> {infection.common.join(", ")}</span>
                  </div>
              </div>

              {/* Treatment Section (3D Flip Effect Container) */}
              <div className="relative perspective-1000">
                <div className={`
                    bg-white/50 rounded-[2rem] p-6 md:p-8 border border-white/60 shadow-inner relative overflow-hidden group-hover:bg-white/80 transition-all duration-500
                    ${isTraineeMode && !isRevealed ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-cyan-300' : ''}
                `}
                onClick={isTraineeMode && !isRevealed ? () => toggleReveal(infection.id) : undefined}
                >
                    {isTraineeMode && !isRevealed ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center group/flip">
                        <div className="bg-gradient-to-br from-cyan-100 to-blue-200 p-5 rounded-full shadow-lg mb-6 animate-bounce border border-white/50">
                           <Brain className="text-blue-600" size={40} />
                        </div>
                        <p className="text-slate-800 font-extrabold text-2xl mb-2 drop-shadow-sm">Test Your Knowledge</p>
                        <p className="text-slate-500 font-medium mb-8">Tap card to reveal empirical therapy</p>
                        <div className="flex items-center text-cyan-600 font-black text-xs uppercase tracking-[0.2em] animate-pulse group-hover/flip:text-cyan-500">
                            <RotateCw size={16} className="mr-2"/> Flip to Reveal
                        </div>
                    </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                        <div>
                        <p className="text-xs font-black text-cyan-700 uppercase tracking-widest mb-3 flex items-center"><CheckCircle size={14} className="mr-1.5"/> First Line Therapy</p>
                        <p className="font-black text-slate-900 text-2xl md:text-3xl leading-tight drop-shadow-sm">{rec.first || "Consult ID"}</p>
                        {rec.warning && (
                            <div className="mt-5 flex items-start space-x-3 text-xs text-rose-900 bg-rose-50/80 p-4 rounded-xl border border-rose-200 shadow-sm">
                            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-rose-600" />
                            <span className="font-bold text-sm leading-snug">{rec.warning}</span>
                            </div>
                        )}
                        </div>
                        <div className="md:border-l md:border-slate-300/30 md:pl-8">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Alternatives</p>
                        <p className="text-slate-700 font-bold text-lg md:text-xl mb-6 leading-snug">{rec.alt || "None / Consult"}</p>
                        
                        <div className="inline-flex items-center space-x-3 bg-slate-50/50 px-5 py-3 rounded-2xl border border-slate-200/60 text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                <Activity size={16} className="text-slate-400"/>
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400">Duration</span>
                                <span className="text-base font-black text-slate-800">{typeof rec.dur === 'object' ? `${rec.dur.uncomplicated} (Uncomp) - ${rec.dur.complicated} (Comp)` : rec.dur} days</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
              </div>

              {/* Footer Notes */}
              {(infection.notes || (isTraineeMode && isRevealed)) && (
                <div className="mt-6 flex items-start space-x-3 text-sm text-slate-600 px-5 py-4 bg-slate-50/40 rounded-2xl border border-white/30 backdrop-blur-sm">
                  <Info size={18} className="mt-0.5 text-cyan-600 flex-shrink-0" />
                  <span className="italic font-medium">{infection.notes}</span>
                </div>
              )}
            </Glass3DCard>
          </div>
        );
      })}
    </div>
  );
};

const AntibiogramView = () => {
  const sortedData = [...ANTIBIOGRAM_DATA].sort((a,b) => a.organism.localeCompare(b.organism));
  
  const getSusColor = (val) => {
    // Neon glow effects for percentages
    if (val >= 90) return "bg-emerald-500 text-white font-black shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-400";
    if (val >= 75) return "bg-amber-400 text-amber-900 font-black shadow-[0_0_15px_rgba(251,191,36,0.5)] border border-amber-300";
    return "bg-rose-500 text-white font-black shadow-[0_0_15px_rgba(244,63,94,0.5)] border border-rose-400";
  };

  return (
    <Glass3DCard theme="cyan" className="p-0 border-0 bg-transparent shadow-none" noPadding>
      <div className="p-6 md:p-10 pb-6 bg-white/60 backdrop-blur-xl rounded-t-[2.5rem] border border-white/40 border-b-0 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight drop-shadow-sm">Antibiogram Data</h3>
            <p className="text-slate-600 font-bold mt-2 text-lg">Susceptibility rates (%) for Central Ohio.</p>
          </div>
          <div className="flex items-center space-x-3 text-xs bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md self-start md:self-auto">
            <span className="flex items-center font-bold text-slate-700"><span className="w-3 h-3 bg-emerald-500 rounded-full mr-2 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> &ge;90%</span>
            <span className="flex items-center font-bold text-slate-700"><span className="w-3 h-3 bg-amber-400 rounded-full mr-2 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span> 75-89%</span>
            <span className="flex items-center font-bold text-slate-700"><span className="w-3 h-3 bg-rose-500 rounded-full mr-2 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span> &lt;75%</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-b-[2.5rem] border border-white/40 shadow-2xl bg-white/30 backdrop-blur-md">
        <table className="w-full text-sm text-left border-collapse min-w-[600px]">
          <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white uppercase font-bold tracking-wider text-xs shadow-lg relative z-10">
            <tr>
              <th className="px-8 py-6 tracking-widest">Organism</th>
              <th className="px-8 py-6 tracking-widest">Antibiotic</th>
              <th className="px-8 py-6 text-center tracking-widest">% Susceptible</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {sortedData.map((row, idx) => (
              <tr key={idx} className="group hover:bg-white/60 transition-all duration-200 even:bg-white/10 odd:bg-white/20">
                <td className="px-8 py-5 font-black text-slate-800 group-hover:text-cyan-700 transition-colors drop-shadow-sm text-base">{row.organism}</td>
                <td className="px-8 py-5 text-slate-700 font-bold">{row.drug}</td>
                <td className="px-8 py-5 text-center">
                  <span className={`inline-block px-5 py-2 rounded-full text-xs tracking-wide transform group-hover:scale-110 transition-transform duration-200 ${getSusColor(row.sus)}`}>
                    {row.sus}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Glass3DCard>
  );
};

const RenalHelper = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredDrugs = Object.entries(RENAL_DATA).filter(([name]) => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Glass3DCard theme="cyan" className="bg-white/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <div className="bg-orange-100 p-3 rounded-2xl mr-4 text-orange-600 border border-orange-200 shadow-md"><Activity size={28} /></div>
          <h3 className="text-3xl font-black text-slate-800 drop-shadow-sm">Renal Dosing Helper</h3>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Find drug..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white/60 border border-slate-200 rounded-2xl text-base focus:ring-4 focus:ring-cyan-500/20 outline-none w-full md:w-80 transition-all focus:bg-white shadow-inner"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {filteredDrugs.map(([name, dosing]) => (
          <div key={name} className="bg-white/60 p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:bg-white/90 duration-500 group">
            <h4 className="text-2xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-3 group-hover:text-cyan-800 transition-colors">{name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50/80 p-5 rounded-2xl border border-green-100 hover:scale-[1.03] transition-transform hover:shadow-md">
                <span className="block text-[10px] font-black text-green-800 uppercase tracking-widest mb-3 opacity-70 border-b border-green-200 pb-1">Normal ({'>'}60)</span>
                <span className="text-lg font-bold text-slate-800 leading-snug">{dosing.normal}</span>
              </div>
              <div className="bg-yellow-50/80 p-5 rounded-2xl border border-yellow-100 hover:scale-[1.03] transition-transform hover:shadow-md">
                <span className="block text-[10px] font-black text-yellow-800 uppercase tracking-widest mb-3 opacity-70 border-b border-yellow-200 pb-1">Moderate (30-60)</span>
                <span className="text-lg font-bold text-slate-800 leading-snug">{dosing.moderate}</span>
              </div>
              <div className="bg-rose-50/80 p-5 rounded-2xl border border-rose-100 hover:scale-[1.03] transition-transform hover:shadow-md">
                <span className="block text-[10px] font-black text-rose-800 uppercase tracking-widest mb-3 opacity-70 border-b border-rose-200 pb-1">Severe (&lt;30)</span>
                <span className="text-lg font-bold text-slate-800 leading-snug">{dosing.severe}</span>
              </div>
            </div>
            {dosing.notes && (
              <div className="mt-6 flex items-start text-sm text-slate-600 font-bold bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                <Info size={18} className="mr-3 mt-0.5 flex-shrink-0 text-slate-400" />
                {dosing.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </Glass3DCard>
  );
};

/**
 * MAIN APP COMPONENT
 */

export default function AntibioticAtlas() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isTraineeMode, setTraineeMode] = useState(true);
  const [patientContext, setPatientContext] = useState('standard'); 

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (activeView) {
      case 'microbes': return <MicrobesView searchTerm={searchTerm} />;
      case 'antibiotics': return <AntibioticsView searchTerm={searchTerm} />;
      case 'infections': return <InfectionsView searchTerm={searchTerm} isTraineeMode={isTraineeMode} patientContext={patientContext} />;
      case 'antibiogram': return <AntibiogramView />;
      case 'renal': return <RenalHelper />;
      default: return <DashboardView setView={setActiveView} />;
    }
  };

  const getHeaderTitle = () => {
    switch(activeView) {
      case 'microbes': return 'Microbe Encyclopedia';
      case 'antibiotics': return 'Formulary & Drugs';
      case 'infections': return 'Clinical Pathways';
      case 'antibiogram': return 'Antibiogram';
      case 'renal': return 'Renal Dosing';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen font-sans text-slate-900 overflow-hidden relative selection:bg-cyan-200">
      
      {/* GLOBAL BACKGROUND - BAZZITE CRYSTAL THEME (ULTRA) */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-100 via-sky-100 to-blue-50 opacity-100 pointer-events-none"></div>
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      {/* Crystal Refraction Overlay */}
      <div className="fixed top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/10 to-transparent rotate-12 pointer-events-none z-0 mix-blend-overlay"></div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-lg z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* FLOATING SIDEBAR */}
      <aside className={`
        fixed inset-y-4 left-4 z-40 w-80 
        bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[2rem]
        transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
        md:relative md:inset-0 md:m-6 md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
        flex flex-col text-white
      `}>
        <div className="p-8 border-b border-white/10 flex items-center space-x-4">
          <div className="bg-cyan-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.6)]">
            <Beaker size={28} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight text-white drop-shadow-md">ABX Atlas</h1>
            <p className="text-[10px] text-cyan-300 uppercase tracking-[0.2em] font-bold mt-1">Central Ohio</p>
          </div>
        </div>

        <nav className="p-6 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
          <NavItem 
            icon={Activity} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => { setActiveView('dashboard'); setSidebarOpen(false); }} 
          />
          <NavItem 
            icon={Stethoscope} 
            label="Infections" 
            active={activeView === 'infections'} 
            onClick={() => { setActiveView('infections'); setSidebarOpen(false); }} 
          />
          <NavItem 
            icon={Bug} 
            label="Microbes" 
            active={activeView === 'microbes'} 
            onClick={() => { setActiveView('microbes'); setSidebarOpen(false); }} 
          />
          <NavItem 
            icon={Pill} 
            label="Antibiotics" 
            active={activeView === 'antibiotics'} 
            onClick={() => { setActiveView('antibiotics'); setSidebarOpen(false); }} 
          />
          <NavItem 
            icon={Thermometer} 
            label="Antibiogram" 
            active={activeView === 'antibiogram'} 
            onClick={() => { setActiveView('antibiogram'); setSidebarOpen(false); }} 
          />
          <div className="pt-8 mt-4 border-t border-white/10">
            <p className="px-4 text-[10px] font-black text-cyan-500 uppercase mb-4 tracking-[0.2em]">Tools</p>
            <NavItem 
              icon={AlertOctagon} 
              label="Renal Dosing" 
              active={activeView === 'renal'} 
              onClick={() => { setActiveView('renal'); setSidebarOpen(false); }} 
            />
          </div>
        </nav>

        <div className="p-6 m-4 rounded-[1.5rem] bg-white/5 border border-white/10 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2.5">
              <GraduationCap size={20} className={isTraineeMode ? "text-cyan-300" : "text-slate-500"} />
              <span className="text-sm font-bold text-slate-200">Trainee Mode</span>
            </div>
            <button 
              onClick={() => setTraineeMode(!isTraineeMode)}
              className={`w-12 h-7 rounded-full p-1 transition-all duration-500 ease-in-out ${isTraineeMode ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-slate-700'}`}
            >
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-500 ${isTraineeMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center font-bold tracking-wide uppercase">
            {isTraineeMode ? "Active Recall Enabled" : "Quick Reference Mode"}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Floating Glass Header */}
        <header className="px-4 py-3 md:px-8 md:py-6 flex-shrink-0 z-20">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/40 rounded-[2rem] shadow-lg px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-4 text-slate-600 hover:text-cyan-600 md:hidden p-2 rounded-xl hover:bg-white/50 transition-colors">
                <Menu size={24} />
              </button>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">{getHeaderTitle()}</h2>
            </div>

            <div className="flex items-center space-x-3 md:space-x-5">
              
              {/* Patient Context Switcher - Desktop */}
              {activeView === 'infections' && (
                <div className="hidden lg:flex items-center bg-white/50 p-1.5 rounded-2xl border border-white/50 shadow-inner">
                  <button onClick={() => setPatientContext('standard')} className={`p-2.5 rounded-xl transition-all ${patientContext === 'standard' ? 'bg-white shadow-md text-cyan-600 font-bold scale-105' : 'text-slate-500 hover:bg-white/50'}`} title="Standard"><User size={20} /></button>
                  <button onClick={() => setPatientContext('icu')} className={`p-2.5 rounded-xl transition-all ${patientContext === 'icu' ? 'bg-white shadow-md text-red-600 font-bold scale-105' : 'text-slate-500 hover:bg-white/50'}`} title="ICU"><Activity size={20} /></button>
                  <button onClick={() => setPatientContext('transplant')} className={`p-2.5 rounded-xl transition-all ${patientContext === 'transplant' ? 'bg-white shadow-md text-purple-600 font-bold scale-105' : 'text-slate-500 hover:bg-white/50'}`} title="Transplant"><ShieldAlert size={20} /></button>
                  <button onClick={() => setPatientContext('peds')} className={`p-2.5 rounded-xl transition-all ${patientContext === 'peds' ? 'bg-white shadow-md text-green-600 font-bold scale-105' : 'text-slate-500 hover:bg-white/50'}`} title="Pediatrics"><Baby size={20} /></button>
                </div>
              )}

              {/* Search - Desktop */}
              {activeView !== 'dashboard' && activeView !== 'antibiogram' && activeView !== 'renal' && (
                <div className="relative hidden lg:block group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-600 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search protocols..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-white/50 hover:bg-white focus:bg-white border border-transparent focus:border-cyan-300 rounded-2xl text-sm focus:ring-4 focus:ring-cyan-100 w-72 transition-all outline-none font-bold shadow-inner text-slate-700 placeholder-slate-400"
                  />
                </div>
              )}
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black shadow-[0_4px_15px_rgba(6,182,212,0.4)] border-[3px] border-white cursor-pointer hover:scale-105 transition-transform text-sm md:text-base">
                MD
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sub-Header (Sticky) */}
        <div className="md:hidden px-4 pb-4 sticky top-0 z-10">
           {activeView === 'infections' && (
            <div className="flex justify-between bg-white/70 backdrop-blur-xl p-2 rounded-2xl border border-white/40 mb-3 shadow-lg">
              <button onClick={() => setPatientContext('standard')} className={`flex-1 flex justify-center py-2.5 rounded-xl text-xs font-black transition-all ${patientContext === 'standard' ? 'bg-white shadow-md text-cyan-600' : 'text-slate-500'}`}>Std</button>
              <button onClick={() => setPatientContext('icu')} className={`flex-1 flex justify-center py-2.5 rounded-xl text-xs font-black transition-all ${patientContext === 'icu' ? 'bg-white shadow-md text-red-600' : 'text-slate-500'}`}>ICU</button>
              <button onClick={() => setPatientContext('transplant')} className={`flex-1 flex justify-center py-2.5 rounded-xl text-xs font-black transition-all ${patientContext === 'transplant' ? 'bg-white shadow-md text-purple-600' : 'text-slate-500'}`}>Tx</button>
              <button onClick={() => setPatientContext('peds')} className={`flex-1 flex justify-center py-2.5 rounded-xl text-xs font-black transition-all ${patientContext === 'peds' ? 'bg-white shadow-md text-green-600' : 'text-slate-500'}`}>Peds</button>
            </div>
          )}
           {activeView !== 'dashboard' && activeView !== 'antibiogram' && activeView !== 'renal' && (
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl text-sm w-full shadow-lg focus:ring-4 focus:ring-cyan-500/20 outline-none font-bold text-slate-800 placeholder-slate-400"
                />
              </div>
           )}
        </div>

        {/* Scrollable Content with Snap behavior */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth snap-y snap-mandatory lg:snap-none">
          <div className="max-w-7xl mx-auto pb-32 md:pb-20">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
