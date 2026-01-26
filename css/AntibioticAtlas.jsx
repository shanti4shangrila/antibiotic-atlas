import React, { useState, useMemo, useEffect } from 'react';
import { 
  Book, Bug, Pill, Activity, ShieldAlert, Search, Menu, X, 
  ChevronRight, Beaker, Stethoscope, GraduationCap, Info, 
  Thermometer, AlertTriangle, Brain, Syringe, Baby, User, 
  Users, AlertOctagon, FileText, CheckCircle, ArrowRight,
  Droplet, Zap, Hexagon, Filter
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * ABX ATLAS DATA STORE
 * ------------------------------------------------------------------
 */

const METADATA = {
  region: "Central Ohio",
  version: "2.3.0-prism",
  lastUpdated: "2026-02-15",
  sources: ["IDSA", "Sanford Guide", "Ohio Dept of Health", "CDC"],
  reportableOhio: ["tuberculosis", "measles", "meningococcal_disease", "legionellosis", "gonorrhea", "anthrax_inhalational"]
};

// --- MICROBES ---
const MICROBES = [
  // GRAM NEGATIVE
  { id: "escherichia_coli", name: "Escherichia coli", type: "gram-negative", category: "Enterobacterales", resistance: ["ESBL", "AmpC"], notes: "High fluoroquinolone resistance in Ohio." },
  { id: "klebsiella_pneumoniae", name: "Klebsiella pneumoniae", type: "gram-negative", category: "Enterobacterales", resistance: ["ESBL", "KPC"], notes: "Carbapenem resistance emerging." },
  { id: "pseudomonas_aeruginosa", name: "Pseudomonas aeruginosa", type: "gram-negative", category: "Non-fermenter", resistance: ["Efflux", "Porin loss"], notes: "ICU-associated pathogen." },
  { id: "enterobacter_cloacae", name: "Enterobacter cloacae", type: "gram-negative", category: "Enterobacterales", resistance: ["AmpC"], notes: "Avoid 3rd gen cephalosporins (AmpC induction)." },
  { id: "serratia_marcescens", name: "Serratia marcescens", type: "gram-negative", category: "Enterobacterales", resistance: ["AmpC"], notes: "Intrinsic resistance to Cefazolin/Nitrofurantoin." },
  { id: "acinetobacter_baumannii", name: "Acinetobacter baumannii", type: "gram-negative", category: "Non-fermenter", resistance: ["Carbapenem resistance"], notes: "Primarily ICU outbreaks." },
  { id: "bacteroides_fragilis", name: "Bacteroides fragilis", type: "gram-negative", category: "Anaerobe", resistance: ["Beta-lactamase"], notes: "High anaerobic prevalence." },
  { id: "neisseria_gonorrhoeae", name: "Neisseria gonorrhoeae", type: "gram-negative", category: "Diplococcus", resistance: ["Fluoroquinolones"], notes: "Dual therapy required." },
  { id: "neisseria_meningitidis", name: "Neisseria meningitidis", type: "gram-negative", category: "Diplococcus", resistance: [], notes: "Droplet precautions." },
  { id: "haemophilus_influenzae", name: "Haemophilus influenzae", type: "gram-negative", category: "Coccobacilli", resistance: ["Beta-lactamase"], notes: "Common in COPD exacerbations." },
  { id: "moraxella_catarrhalis", name: "Moraxella catarrhalis", type: "gram-negative", category: "Diplococcus", resistance: ["Beta-lactamase"], notes: "Pediatric ENT pathogen." },
  { id: "legionella_pneumophila", name: "Legionella pneumophila", type: "gram-negative", category: "Atypical", resistance: ["Beta-lactams"], notes: "Water source outbreaks." },
  
  // GRAM POSITIVE
  { id: "staphylococcus_aureus", name: "Staphylococcus aureus", type: "gram-positive", category: "Cocci", resistance: ["MRSA"], notes: "Community and hospital variants." },
  { id: "streptococcus_pneumoniae", name: "Streptococcus pneumoniae", type: "gram-positive", category: "Diplococci", resistance: ["Penicillin resistance"], notes: "Vaccine-modified epidemiology." },
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
  { id: "aspergillus_fumigatus", name: "Aspergillus fumigatus", type: "fungus", category: "Mold", resistance: ["Azole"], notes: "Transplant/Neutropenia risk." },
  { id: "pneumocystis_jirovecii", name: "Pneumocystis jirovecii", type: "fungus", category: "Opportunistic", resistance: [], notes: "HIV/Transplant." },
  { id: "cryptococcus_neoformans", name: "Cryptococcus neoformans", type: "fungus", category: "Yeast", resistance: [], notes: "Meningitis in HIV." },
  { id: "histoplasma_capsulatum", name: "Histoplasma capsulatum", type: "fungus", category: "Dimorphic", resistance: [], notes: "Endemic in Ohio River Valley." },
  { id: "mucor_species", name: "Mucor species", type: "fungus", category: "Mold", resistance: [], notes: "Surgical emergency." },
  { id: "borrelia_burgdorferi", name: "Borrelia burgdorferi", type: "spirochete", category: "Tick-borne", resistance: [], notes: "Lyme disease." },
  { id: "toxoplasma_gondii", name: "Toxoplasma gondii", type: "parasite", category: "Protozoa", resistance: [], notes: "CNS lesions in HIV." }
];

// --- ANTIBIOTICS ---
const ANTIBIOTICS = [
  // Beta Lactams
  { id: "ceftriaxone", name: "Ceftriaxone", class: "Cephalosporin (3rd)", renal: false, notes: "No Pseudomonas coverage. CNS penetration good." },
  { id: "cefepime", name: "Cefepime", class: "Cephalosporin (4th)", renal: true, notes: "Neurotoxicity in renal failure." },
  { id: "piperacillin_tazobactam", name: "Pip-Tazo", class: "Penicillin/BLI", renal: true, notes: "Broad gram-negative/anaerobe coverage." },
  { id: "meropenem", name: "Meropenem", class: "Carbapenem", renal: true, notes: "Reserve for ESBL/MDR. Low seizure risk." },
  { id: "ertapenem", name: "Ertapenem", class: "Carbapenem", renal: true, notes: "No Pseudomonas/Acinetobacter coverage." },
  { id: "cefazolin", name: "Cefazolin", class: "Cephalosporin (1st)", renal: true, notes: "Drug of choice for MSSA." },
  { id: "ampicillin", name: "Ampicillin", class: "Aminopenicillin", renal: true, notes: "Drug of choice for Listeria/Enterococcus." },
  { id: "amoxicillin_clavulanate", name: "Amox-Clav", class: "Penicillin/BLI", renal: true, notes: "Oral step-down option." },
  
  // MRSA/VRE Agents
  { id: "vancomycin", name: "Vancomycin", class: "Glycopeptide", renal: true, notes: "Monitor AUC/Trough. Nephrotoxic." },
  { id: "linezolid", name: "Linezolid", class: "Oxazolidinone", renal: false, notes: "Serotonin syndrome risk. Myelosuppression >2wks." },
  { id: "daptomycin", name: "Daptomycin", class: "Lipopeptide", renal: true, notes: "Inactivated by surfactant (No Pneumonia)." },
  
  // Others
  { id: "ciprofloxacin", name: "Ciprofloxacin", class: "Fluoroquinolone", renal: true, notes: "High collateral damage. Ohio E. coli resistance." },
  { id: "levofloxacin", name: "Levofloxacin", class: "Fluoroquinolone", renal: true, notes: "Respiratory quinolone." },
  { id: "doxycycline", name: "Doxycycline", class: "Tetracycline", renal: false, notes: "Tick-borne, MRSA, Atypicals." },
  { id: "azithromycin", name: "Azithromycin", class: "Macrolide", renal: false, notes: "Anti-inflammatory. Atypicals." },
  { id: "metronidazole", name: "Metronidazole", class: "Nitroimidazole", renal: false, notes: "Anaerobes only. Disulfiram reaction." },
  { id: "nitrofurantoin", name: "Nitrofurantoin", class: "Nitrofuran", renal: true, notes: "Cystitis only. Avoid CrCl <30." },
  { id: "tmp_smx", name: "TMP-SMX", class: "Folate Antagonist", renal: true, notes: "Hyperkalemia risk. PCP/Listeria coverage." },
  { id: "clindamycin", name: "Clindamycin", class: "Lincosamide", renal: false, notes: "Highest C. diff risk. Toxin suppression." },
  { id: "fidaxomicin", name: "Fidaxomicin", class: "Macrolide (Macrocyclic)", renal: false, notes: "First line for C. diff. Expensive." },
  
  // Antifungals/Antivirals/Others
  { id: "fluconazole", name: "Fluconazole", class: "Azole", renal: true, notes: "Candida/Crypto." },
  { id: "voriconazole", name: "Voriconazole", class: "Azole", renal: false, notes: "Aspergillus DOC. Visual changes." },
  { id: "amphotericin_b", name: "Amphotericin B", class: "Polyene", renal: true, notes: "Broad spectrum. Nephrotoxic." },
  { id: "oseltamivir", name: "Oseltamivir", class: "Neuraminidase Inhibitor", renal: true, notes: "Influenza A/B." },
  { id: "rifampin", name: "Rifampin", class: "Rifamycin", renal: false, notes: "Biofilm active. CYP inducer." }
];

// --- INFECTIONS ---
const INFECTIONS = [
  // RESPIRATORY
  {
    id: "cap",
    name: "Community Acquired Pneumonia",
    system: "Respiratory",
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
    common: ["Pseudomonas", "Acinetobacter", "MRSA"],
    standard: { first: "Cefepime + Vancomycin", alt: "Meropenem + Linezolid", dur: "7-14d" },
    icu: { first: "Cefepime + Vancomycin", warning: "Daily de-escalation check" },
    notes: "Requires positive culture from BAL/Mini-BAL."
  },
  {
    id: "legionella",
    name: "Legionella Pneumonia",
    system: "Respiratory",
    common: ["Legionella pneumophila"],
    standard: { first: "Azithromycin", alt: "Levofloxacin", dur: "7-14d" },
    reportable: true,
    notes: "Urinary antigen test available."
  },
  {
    id: "pcp",
    name: "Pneumocystis Pneumonia (PJP)",
    system: "Respiratory",
    common: ["Pneumocystis jirovecii"],
    standard: { first: "TMP-SMX High Dose", alt: "Primaquine + Clindamycin", dur: "21d" },
    notes: "Add steroids if PaO2 < 70 mmHg.",
    immunocompromised: { warning: "Life threatening in HIV/Transplant" }
  },
  {
    id: "histoplasmosis",
    name: "Histoplasmosis",
    system: "Respiratory",
    common: ["Histoplasma capsulatum"],
    standard: { first: "Itraconazole", alt: "Amphotericin B (Severe)", dur: "6-12wks" },
    notes: "Ohio River Valley endemic.",
    reportable: false // Usually not unless outbreak
  },
  {
    id: "tb",
    name: "Pulmonary Tuberculosis",
    system: "Respiratory",
    common: ["Mycobacterium tuberculosis"],
    standard: { first: "RIPE (Rif+Iso+Pyr+Eth)", alt: "Consult ID", dur: "6mo+" },
    reportable: true,
    publicHealth: { warning: "Airborne Isolation & DOT required" }
  },
  {
    id: "anthrax",
    name: "Inhalational Anthrax",
    system: "Respiratory",
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
    common: ["Streptococci", "Anaerobes", "S. aureus"],
    standard: { first: "Ceftriaxone + Metronidazole", alt: "Meropenem", dur: "4-8wks" },
    icu: { warning: "Neurosurgery consult mandatory" }
  },
  {
    id: "crypto_meningitis",
    name: "Cryptococcal Meningitis",
    system: "CNS",
    common: ["Cryptococcus neoformans"],
    standard: { first: "Amphotericin B + Flucytosine", dur: "Induction 2wks" },
    hiv: { warning: "Manage ICP with LPs" }
  },
  {
    id: "toxo",
    name: "CNS Toxoplasmosis",
    system: "CNS",
    common: ["Toxoplasma gondii"],
    standard: { first: "Pyrimethamine + Sulfadiazine", dur: "6wks" },
    hiv: { warning: "Ring enhancing lesions on MRI" }
  },

  // GENITOURINARY
  {
    id: "uti_simple",
    name: "Uncomplicated Cystitis",
    system: "Genitourinary",
    common: ["E. coli", "Klebsiella"],
    standard: { first: "Nitrofurantoin", alt: "Fosfomycin", dur: "5d" },
    pregnancy: { first: "Cephalexin or Nitrofurantoin", warning: "Avoid Fluoroquinolones" },
    notes: "Avoid Nitrofurantoin if CrCl < 30."
  },
  {
    id: "uti_complicated",
    name: "Complicated UTI/Pyelo",
    system: "Genitourinary",
    common: ["E. coli", "Pseudomonas", "Enterococcus"],
    standard: { first: "Ceftriaxone", alt: "Cefepime", dur: "7-14d" },
    icu: { first: "Cefepime", warning: "Cover Pseudomonas" },
    transplant: { first: "Meropenem", warning: "High ESBL risk" },
    notes: "Ohio E. coli has high Cipro resistance."
  },
  {
    id: "cauti",
    name: "Catheter-Associated UTI",
    system: "Genitourinary",
    common: ["E. coli", "Pseudomonas", "Candida"],
    standard: { first: "Cefepime", alt: "Pip-Tazo", dur: "7d" },
    notes: "Remove catheter if possible."
  },
  {
    id: "prostatitis",
    name: "Acute Bacterial Prostatitis",
    system: "Genitourinary",
    common: ["Enterobacterales"],
    standard: { first: "Ciprofloxacin", alt: "TMP-SMX", dur: "2-4wks" },
    notes: "Requires prolonged therapy for penetration."
  },

  // BLOODSTREAM / CARDIO
  {
    id: "sepsis",
    name: "Sepsis (Unknown Source)",
    system: "Systemic",
    common: ["Staph", "E. coli", "Pseudomonas"],
    standard: { first: "Pip-Tazo + Vancomycin", alt: "Meropenem + Linezolid", dur: "7-10d" },
    icu: { warning: "Antibiotics within 1 hour" },
    transplant: { first: "Meropenem + Vancomycin" }
  },
  {
    id: "endocarditis_native",
    name: "Native Valve Endocarditis",
    system: "Cardiovascular",
    common: ["S. aureus", "Viridans Strep", "Enterococcus"],
    standard: { first: "Vancomycin + Ceftriaxone", dur: "4-6wks" },
    notes: "Gentamicin largely abandoned for native Staph."
  },
  {
    id: "endocarditis_prosthetic",
    name: "Prosthetic Valve Endocarditis",
    system: "Cardiovascular",
    common: ["Coag-neg Staph", "S. aureus"],
    standard: { first: "Vancomycin + Rifampin + Gentamicin", dur: "6wks" },
    notes: "Rifampin for biofilm penetration."
  },
  {
    id: "clabsi",
    name: "CLABSI",
    system: "Systemic",
    common: ["Staph", "Candida", "Gram-negatives"],
    standard: { first: "Vancomycin + Cefepime", dur: "14d" },
    icu: { warning: "Pull the line!" }
  },
  {
    id: "neutropenia",
    name: "Febrile Neutropenia",
    system: "Systemic",
    common: ["Pseudomonas", "Enterobacterales"],
    standard: { first: "Cefepime", alt: "Meropenem", dur: "Until counts recover" },
    oncology: { warning: "Emergent antibiotics (<60 min)" }
  },

  // SKIN & SOFT TISSUE
  {
    id: "cellulitis",
    name: "Non-purulent Cellulitis",
    system: "Skin",
    common: ["Strep pyogenes"],
    standard: { first: "Cefazolin", alt: "Clindamycin", dur: "5d" },
    notes: "Cover tinea pedis to prevent recurrence."
  },
  {
    id: "abscess",
    name: "Purulent Abscess",
    system: "Skin",
    common: ["MRSA"],
    standard: { first: "I&D + TMP-SMX", alt: "Doxycycline", dur: "5-7d" },
    notes: "I&D alone sufficient for small abscesses."
  },
  {
    id: "necrotizing_fasciitis",
    name: "Necrotizing Fasciitis",
    system: "Skin",
    common: ["Polymicrobial", "Group A Strep"],
    standard: { first: "Vanc + Pip-Tazo + Clindamycin", dur: "Surgical" },
    icu: { warning: "Immediate Surgical Debridement" },
    notes: "Clindamycin suppresses toxin production."
  },
  {
    id: "burn_infection",
    name: "Burn Wound Infection",
    system: "Skin",
    common: ["Pseudomonas", "S. aureus"],
    standard: { first: "Vancomycin + Cefepime", dur: "Variable" }
  },

  // BONE & JOINT
  {
    id: "osteo_native",
    name: "Osteomyelitis (Native)",
    system: "Musculoskeletal",
    common: ["S. aureus"],
    standard: { first: "Vancomycin", alt: "Cefazolin (if MSSA)", dur: "6wks" },
    notes: "Bone biopsy preferred over swab."
  },
  {
    id: "septic_arthritis",
    name: "Septic Arthritis",
    system: "Musculoskeletal",
    common: ["S. aureus", "Gonorrhea"],
    standard: { first: "Vancomycin + Ceftriaxone", dur: "3-4wks" }
  },
  {
    id: "prosthetic_joint",
    name: "Prosthetic Joint Infection",
    system: "Musculoskeletal",
    common: ["S. epidermidis", "S. aureus"],
    standard: { first: "Debridement + Vanc + Rifampin", dur: "Long term" },
    notes: "Rifampin critical for hardware retention."
  },

  // ABDOMINAL
  {
    id: "ia_complicated",
    name: "Complicated Intra-abdominal",
    system: "Gastrointestinal",
    common: ["E. coli", "Bacteroides", "Streptococci"],
    standard: { first: "Pip-Tazo", alt: "Ceftriaxone + Metronidazole", dur: "4-7d" },
    notes: "Source control (drainage) is key."
  },
  {
    id: "cdiff",
    name: "C. difficile Infection",
    system: "Gastrointestinal",
    common: ["C. difficile"],
    standard: { first: "Fidaxomicin", alt: "Oral Vancomycin", dur: "10d" },
    icu: { first: "Oral Vanc + IV Metronidazole", warning: "Surgical consult if megacolon" },
    notes: "Wash hands with soap."
  },
  {
    id: "pancreatitis",
    name: "Infected Pancreatic Necrosis",
    system: "Gastrointestinal",
    common: ["Enterobacterales"],
    standard: { first: "Meropenem", dur: "2-3wks" },
    notes: "Carbapenems penetrate pancreas best."
  },
  {
    id: "giardia",
    name: "Giardiasis",
    system: "Gastrointestinal",
    common: ["Giardia lamblia"],
    standard: { first: "Metronidazole", dur: "5-7d" }
  },

  // SPECIAL / OTHER
  {
    id: "hiv_pep",
    name: "HIV Post-Exposure Prophylaxis",
    system: "Systemic",
    common: ["HIV"],
    standard: { first: "Tenofovir/Emtricitabine + Dolutegravir", dur: "28d" },
    notes: "Start within 72 hours."
  },
  {
    id: "lyme",
    name: "Lyme Disease",
    system: "Systemic",
    common: ["Borrelia burgdorferi"],
    standard: { first: "Doxycycline", dur: "10-21d" },
    notes: "Rising incidence in Ohio."
  },
  {
    id: "malaria",
    name: "Malaria (Uncomplicated)",
    system: "Systemic",
    common: ["Plasmodium falciparum"],
    standard: { first: "Artemether-Lumefantrine", alt: "Atovaquone-Proguanil" },
    reportable: true
  },
  {
    id: "opsi",
    name: "Post-Splenectomy Sepsis",
    system: "Systemic",
    common: ["Encapsulated organisms"],
    standard: { first: "Ceftriaxone + Vancomycin", dur: "10-14d" },
    asplenic: { warning: "Medical Emergency" }
  },
  {
    id: "mucor",
    name: "Mucormycosis",
    system: "HEENT",
    common: ["Mucorales"],
    standard: { first: "Liposomal Amphotericin B", dur: "Months" },
    notes: "Surgical Emergency. Diabetic Ketoacidosis is risk factor."
  }
];

// --- ANTIBIOGRAM DATA ---
const ANTIBIOGRAM_DATA = [
  { organism: "E. coli", drug: "Ceftriaxone", sus: 82 },
  { organism: "E. coli", drug: "Ciprofloxacin", sus: 61 },
  { organism: "E. coli", drug: "Nitrofurantoin", sus: 94 },
  { organism: "E. coli", drug: "TMP-SMX", sus: 68 },
  { organism: "P. aeruginosa", drug: "Cefepime", sus: 78 },
  { organism: "P. aeruginosa", drug: "Pip-Tazo", sus: 74 },
  { organism: "P. aeruginosa", drug: "Meropenem", sus: 81 },
  { organism: "P. aeruginosa", drug: "Ciprofloxacin", sus: 72 },
  { organism: "S. aureus (MSSA)", drug: "Oxacillin", sus: 58 },
  { organism: "S. aureus", drug: "Vancomycin", sus: 100 },
  { organism: "S. aureus", drug: "Linezolid", sus: 100 },
  { organism: "E. faecium", drug: "Vancomycin", sus: 62 },
  { organism: "E. faecium", drug: "Daptomycin", sus: 98 },
  { organism: "A. baumannii", drug: "Meropenem", sus: 48 },
  { organism: "A. baumannii", drug: "Amp-Sulbactam", sus: 72 }
];

// --- RENAL DOSING TIERS ---
const RENAL_LOGIC = {
  "eGFR<30": [
    { drug: "Vancomycin", rule: "Extended interval (q24-48h). Monitor troughs." },
    { drug: "Cefepime", rule: "Dose reduction (e.g. 1g q24h) essential to prevent encephalopathy." },
    { drug: "Pip-Tazo", rule: "Reduce dose to 2.25g q6h or 3.375g q8h." },
    { drug: "Meropenem", rule: "Reduce to 500mg q12h or q24h." },
    { drug: "Nitrofurantoin", rule: "Contraindicated." },
    { drug: "Aminoglycosides", rule: "Avoid if possible." }
  ],
  "eGFR 30-59": [
    { drug: "Cefepime", rule: "2g q24h or 1g q12h." },
    { drug: "Meropenem", rule: "500mg q6-8h or 1g q12h." },
    { drug: "Levofloxacin", rule: "750mg q48h." }
  ]
};

/**
 * COMPONENTS
 */

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm ${
      active 
        ? 'bg-white/20 text-white shadow-lg ring-1 ring-white/30 font-bold scale-[1.02]' 
        : 'text-cyan-100 hover:bg-white/10 hover:text-white hover:scale-[1.01]'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium tracking-wide">{label}</span>
  </button>
);

const Glass3DCard = ({ children, className = "", onClick, noPadding = false, theme = "cyan" }) => {
  // Theme-based lighting mapping
  const themes = {
    cyan: "border-t-cyan-200/50 border-l-cyan-200/50 border-r-cyan-900/10 border-b-cyan-900/10 shadow-[8px_8px_16px_rgba(22,78,99,0.1),-4px_-4px_12px_rgba(255,255,255,0.5)]",
    rose: "border-t-rose-200/50 border-l-rose-200/50 border-r-rose-900/10 border-b-rose-900/10 shadow-[8px_8px_16px_rgba(136,19,55,0.1),-4px_-4px_12px_rgba(255,255,255,0.5)]",
    indigo: "border-t-indigo-200/50 border-l-indigo-200/50 border-r-indigo-900/10 border-b-indigo-900/10 shadow-[8px_8px_16px_rgba(49,46,129,0.1),-4px_-4px_12px_rgba(255,255,255,0.5)]",
    violet: "border-t-violet-200/50 border-l-violet-200/50 border-r-violet-900/10 border-b-violet-900/10 shadow-[8px_8px_16px_rgba(91,33,182,0.1),-4px_-4px_12px_rgba(255,255,255,0.5)]",
    amber: "border-t-amber-200/50 border-l-amber-200/50 border-r-amber-900/10 border-b-amber-900/10 shadow-[8px_8px_16px_rgba(120,53,15,0.1),-4px_-4px_12px_rgba(255,255,255,0.5)]",
    emerald: "border-t-emerald-200/50 border-l-emerald-200/50 border-r-emerald-900/10 border-b-emerald-900/10 shadow-[8px_8px_16px_rgba(6,78,59,0.1),-4px_-4px_12px_rgba(255,255,255,0.5)]",
  };

  return (
    <div 
      onClick={onClick} 
      className={`
        relative overflow-hidden
        bg-white/60 backdrop-blur-xl border-2
        rounded-2xl transition-all duration-500 ease-out
        ${themes[theme] || themes.cyan}
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl' : ''}
        ${noPadding ? '' : 'p-4 md:p-6'}
        ${className}
      `}
    >
      {/* Volumetric Glint */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-black/5 opacity-60 pointer-events-none" />
      
      {/* Specular Highlight */}
      <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/20 to-transparent rotate-45 transform translate-y-full transition-transform duration-1000 hover:translate-y-[-50%] pointer-events-none" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Badge = ({ children, color = "blue", icon: Icon }) => {
  const colors = {
    blue: "bg-cyan-100 text-cyan-900 border-cyan-200",
    green: "bg-emerald-100 text-emerald-900 border-emerald-200",
    red: "bg-rose-100 text-rose-900 border-rose-200",
    purple: "bg-violet-100 text-violet-900 border-violet-200",
    orange: "bg-amber-100 text-amber-900 border-amber-200",
    yellow: "bg-yellow-100 text-yellow-900 border-yellow-200",
    slate: "bg-slate-100 text-slate-900 border-slate-200"
  };
  return (
    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border shadow-sm backdrop-blur-md uppercase tracking-wider ${colors[color] || colors.blue}`}>
      {Icon && <Icon size={12} />}
      <span>{children}</span>
    </span>
  );
};

// --- SUB-VIEWS ---

const DashboardView = ({ setView }) => (
  <div className="space-y-4 md:space-y-8 animate-in fade-in zoom-in duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      
      {/* Hero Card - The "Main Crystal" */}
      <div className="lg:col-span-8 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 backdrop-blur-2xl rounded-3xl p-6 md:p-8 text-white shadow-[0_20px_50px_-12px_rgba(6,182,212,0.5)] border-t border-l border-white/30 relative overflow-hidden group hover:shadow-[0_25px_60px_-12px_rgba(6,182,212,0.6)] transition-all duration-500">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-cyan-300/30 transition-all duration-1000 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
             <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md border border-white/20 shadow-inner">
               <Activity size={20} className="text-white" />
             </div>
             <span className="text-cyan-50 font-bold tracking-widest text-xs md:text-sm uppercase drop-shadow-md">Clinical Decision Support</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight drop-shadow-lg">Antibiotic Atlas <span className="text-cyan-200 font-light block text-2xl md:text-3xl mt-1">Central Ohio Region</span></h2>
          <p className="text-cyan-50 text-base md:text-lg mb-8 max-w-lg leading-relaxed font-medium drop-shadow">
            The definitive antimicrobial stewardship guide. Access evidence-based pathways, antibiograms, and dosing protocols instantly.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setView('infections')}
              className="bg-white text-cyan-900 px-8 py-3.5 rounded-xl font-bold hover:bg-cyan-50 transition-all shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] hover:-translate-y-1 active:scale-95 flex items-center group/btn w-full md:w-auto justify-center"
            >
              Start Guide <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center space-x-2 px-5 py-3.5 bg-black/20 rounded-xl backdrop-blur-md border border-white/10 w-full md:w-auto justify-center shadow-inner">
              <CheckCircle size={18} className="text-emerald-400" />
              <span className="text-sm font-semibold tracking-wide">Updated: {METADATA.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats/Quick Actions Column */}
      <div className="lg:col-span-4 space-y-4 md:space-y-6 flex flex-col">
        <Glass3DCard onClick={() => setView('antibiogram')} theme="violet" className="flex-1 group bg-gradient-to-br from-white/90 to-violet-100/50">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-violet-700 transition-colors drop-shadow-sm">Antibiogram</h3>
                  <p className="text-slate-500 text-sm mt-1 font-medium group-hover:text-slate-700">Local susceptibility data.</p>
               </div>
               <div className="bg-gradient-to-br from-violet-100 to-violet-200 p-3 rounded-2xl text-violet-700 group-hover:scale-110 transition-transform shadow-inner border border-violet-200">
                 <Activity size={24} />
               </div>
            </div>
            <div className="mt-4">
               <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                 <div className="bg-gradient-to-r from-emerald-400 to-teal-500 w-[82%] h-full group-hover:animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               </div>
               <div className="flex justify-between text-xs mt-2 text-slate-600 font-bold uppercase tracking-wider">
                 <span>E. coli Susceptibility</span>
                 <span className="text-emerald-600 drop-shadow-sm">82%</span>
               </div>
            </div>
          </div>
        </Glass3DCard>

        <Glass3DCard onClick={() => setView('microbes')} theme="cyan" className="flex-1 group bg-gradient-to-br from-white/90 to-cyan-100/50">
           <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-cyan-700 transition-colors drop-shadow-sm">Microbes</h3>
                <p className="text-slate-500 text-sm mt-1 font-medium group-hover:text-slate-700">Encyclopedia of pathogens.</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-3 rounded-2xl text-cyan-700 group-hover:scale-110 transition-transform shadow-inner border border-cyan-200">
                 <Bug size={24} />
               </div>
           </div>
        </Glass3DCard>
      </div>
    </div>

    {/* Alert Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <Glass3DCard theme="rose" className="border-l-8 border-l-rose-500 bg-gradient-to-r from-rose-50/40 to-white/80">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center text-lg drop-shadow-sm">
          <AlertTriangle className="text-rose-600 mr-2 drop-shadow-md" fill="currentColor" fillOpacity={0.2} />
          Critical Regional Alerts
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start space-x-3 text-sm text-slate-800 bg-white/60 p-3 rounded-xl border border-rose-200 shadow-sm hover:shadow-md transition-shadow">
            <AlertOctagon size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
            <span className="leading-snug font-medium"><strong>Fluoroquinolones:</strong> Avoid for empiric UTI due to high local E. coli resistance (&gt;20%).</span>
          </li>
          <li className="flex items-start space-x-3 text-sm text-slate-800 bg-white/60 p-3 rounded-xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
            <Bug size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <span className="leading-snug font-medium"><strong>Lyme Disease:</strong> Increasing incidence in Central Ohio. Consider Doxycycline for rash.</span>
          </li>
        </ul>
      </Glass3DCard>

      <Glass3DCard theme="cyan" className="border-l-8 border-l-cyan-500 bg-gradient-to-r from-cyan-50/40 to-white/80">
         <h3 className="font-bold text-slate-900 mb-4 flex items-center text-lg drop-shadow-sm">
          <Book className="text-cyan-600 mr-2 drop-shadow-md" fill="currentColor" fillOpacity={0.2} />
          Formulary Updates
        </h3>
        <div className="space-y-3">
           <div className="flex items-center justify-between text-sm p-3 bg-white/70 hover:bg-white rounded-xl transition-all cursor-pointer shadow-sm hover:shadow border border-white/50">
             <span className="text-slate-800 font-bold">Fidaxomicin</span>
             <Badge color="green">Preferred (C. diff)</Badge>
           </div>
           <div className="flex items-center justify-between text-sm p-3 bg-white/70 hover:bg-white rounded-xl transition-all cursor-pointer shadow-sm hover:shadow border border-white/50">
             <span className="text-slate-800 font-bold">Meropenem</span>
             <Badge color="yellow">Restricted</Badge>
           </div>
           <div className="flex items-center justify-between text-sm p-3 bg-white/70 hover:bg-white rounded-xl transition-all cursor-pointer shadow-sm hover:shadow border border-white/50">
             <span className="text-slate-800 font-bold">Aminoglycosides</span>
             <Badge color="red">High Alert</Badge>
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
          card: "bg-gradient-to-br from-white/95 via-rose-50/50 to-rose-100/30",
          icon: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/40 ring-2 ring-rose-200",
          badge: "bg-rose-100 text-rose-900 border-rose-300 shadow-sm",
          title: "text-slate-800 group-hover:text-rose-800"
        };
      case 'gram-positive':
        return {
          theme: 'indigo',
          card: "bg-gradient-to-br from-white/95 via-indigo-50/50 to-blue-100/30",
          icon: "bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-200",
          badge: "bg-indigo-100 text-indigo-900 border-indigo-300 shadow-sm",
          title: "text-slate-800 group-hover:text-indigo-800"
        };
      case 'fungus':
        return {
          theme: 'violet',
          card: "bg-gradient-to-br from-white/95 via-violet-50/50 to-purple-100/30",
          icon: "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/40 ring-2 ring-violet-200",
          badge: "bg-violet-100 text-violet-900 border-violet-300 shadow-sm",
          title: "text-slate-800 group-hover:text-violet-800"
        };
      default:
        return {
          theme: 'amber',
          card: "bg-gradient-to-br from-white/95 via-amber-50/50 to-orange-100/30",
          icon: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/40 ring-2 ring-amber-200",
          badge: "bg-amber-100 text-amber-900 border-amber-300 shadow-sm",
          title: "text-slate-800 group-hover:text-amber-800"
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-0">
      {filtered.map(m => {
        const style = getMicrobeStyle(m.type);
        return (
          <div key={m.id} className="snap-start scroll-mt-24">
            <Glass3DCard theme={style.theme} className={`group flex flex-col h-full ${style.card}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 rounded-2xl ${style.icon} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Bug size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${style.badge}`}>
                   {m.type === "fungus" ? "Fungus" : m.type === "parasite" ? "Parasite" : m.type === "spirochete" ? "Spirochete" : m.type}
                </span>
              </div>
              <h3 className={`text-xl md:text-2xl font-black mb-1 drop-shadow-sm transition-colors ${style.title}`}>{m.name}</h3>
              <p className="text-sm font-bold text-slate-400 italic mb-6">{m.category}</p>
              
              <div className="mt-auto space-y-3 text-sm bg-white/50 p-4 rounded-xl backdrop-blur-md border border-white/50 shadow-inner group-hover:bg-white/80 transition-colors">
                {m.resistance.length > 0 && (
                  <div className="flex items-start space-x-2">
                    <ShieldAlert size={16} className="mt-0.5 text-rose-600 flex-shrink-0 drop-shadow-sm" />
                    <span className="text-slate-800 font-bold">Resist: <span className="font-medium text-slate-600">{m.resistance.join(", ")}</span></span>
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <Info size={16} className="mt-0.5 text-cyan-600 flex-shrink-0 drop-shadow-sm" />
                  <span className="font-semibold text-slate-600 leading-snug">{m.notes}</span>
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
        card: "bg-gradient-to-br from-white/95 via-cyan-50/50 to-cyan-100/30",
        badge: "bg-cyan-100 text-cyan-900 border-cyan-300",
        icon: "bg-cyan-100 text-cyan-700 border-cyan-200",
        title: "text-slate-800 group-hover:text-cyan-800"
      };
    if (lc.includes('carbapenem')) 
      return {
        theme: 'violet',
        card: "bg-gradient-to-br from-white/95 via-violet-50/50 to-violet-100/30",
        badge: "bg-violet-100 text-violet-900 border-violet-300",
        icon: "bg-violet-100 text-violet-700 border-violet-200",
        title: "text-slate-800 group-hover:text-violet-800"
      };
    if (lc.includes('glycopeptide') || lc.includes('oxazolidinone')) 
      return {
        theme: 'rose',
        card: "bg-gradient-to-br from-white/95 via-pink-50/50 to-pink-100/30",
        badge: "bg-pink-100 text-pink-900 border-pink-300",
        icon: "bg-pink-100 text-pink-700 border-pink-200",
        title: "text-slate-800 group-hover:text-pink-800"
      };
    if (lc.includes('fluoroquinolone') || lc.includes('tetracycline')) 
      return {
        theme: 'amber',
        card: "bg-gradient-to-br from-white/95 via-amber-50/50 to-amber-100/30",
        badge: "bg-amber-100 text-amber-900 border-amber-300",
        icon: "bg-amber-100 text-amber-700 border-amber-200",
        title: "text-slate-800 group-hover:text-amber-800"
      };
    
    return {
      theme: 'emerald',
      card: "bg-gradient-to-br from-white/95 via-emerald-50/50 to-emerald-100/30",
      badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
      icon: "bg-emerald-100 text-emerald-700 border-emerald-200",
      title: "text-slate-800 group-hover:text-emerald-800"
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-0">
      {filtered.map(a => {
        const style = getDrugStyle(a.class);
        return (
        <div key={a.id} className="snap-start scroll-mt-24">
          <Glass3DCard theme={style.theme} className={`group flex flex-col h-full ${style.card}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl shadow-inner border ${style.icon} group-hover:scale-110 transition-transform duration-300`}>
                <Pill size={24} />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${style.badge}`}>
                {a.class}
              </span>
            </div>
            <h3 className={`text-xl md:text-2xl font-black mb-6 transition-colors duration-300 drop-shadow-sm ${style.title}`}>{a.name}</h3>
            
            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between text-sm bg-white/60 p-3 rounded-xl border border-white/60 shadow-inner group-hover:bg-white/80 transition-colors">
                <span className="text-slate-600 flex items-center font-bold"><Activity size={16} className="mr-2 text-slate-400"/>Renal Adjust</span>
                <span className={`font-black px-2 py-1 rounded text-xs uppercase tracking-wide border shadow-sm ${a.renal ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"}`}>
                  {a.renal ? "Required" : "None"}
                </span>
              </div>
              <div className="flex items-start space-x-2 text-sm p-2">
                <Info size={16} className="mt-0.5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-700 leading-relaxed font-semibold">{a.notes}</span>
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
        gradient: "bg-gradient-to-br from-white/95 via-cyan-50/40 to-white/80",
        border: "border-l-[6px] border-l-cyan-500"
      };
    } else {
      return {
        theme: 'rose',
        gradient: "bg-gradient-to-br from-white/95 via-rose-50/40 to-white/80",
        border: "border-l-[6px] border-l-rose-500"
      };
    }
  };

  return (
    <div className="space-y-12 pb-24 md:pb-20">
      {filtered.map((infection, index) => {
        const rec = getRecommendation(infection);
        const isRevealed = revealedAnswers[infection.id];
        const style = getCardStyle(rec.source);

        return (
          <div key={infection.id} className="snap-start scroll-mt-24">
            <Glass3DCard theme={style.theme} className={`
              ${style.border} transition-all duration-500 min-h-[300px] flex flex-col justify-between ${style.gradient}
            `}>
              
              {/* Header */}
              <div className="mb-6">
                 <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge color="purple" icon={Activity}>{infection.system}</Badge>
                    {rec.source !== 'Standard' && <Badge color="orange" icon={AlertOctagon}>{rec.source}</Badge>}
                    {infection.reportable && <Badge color="red" icon={FileText}>Reportable</Badge>}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 tracking-tight drop-shadow-sm group-hover:text-cyan-800 transition-colors">{infection.name}</h3>
                  <div className="flex items-start space-x-2 text-slate-700 text-sm md:text-base bg-white/60 p-3 rounded-xl inline-block border border-white/60 shadow-sm backdrop-blur-md">
                    <Bug size={18} className="mt-0.5 text-slate-500" />
                    <span><span className="font-extrabold text-slate-800">Pathogens:</span> {infection.common.join(", ")}</span>
                  </div>
              </div>

              {/* Treatment Section */}
              <div className="bg-white/40 rounded-2xl p-6 md:p-8 border border-white/50 shadow-inner relative overflow-hidden group-hover:bg-white/60 transition-colors">
                {isTraineeMode && !isRevealed ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-4 rounded-full shadow-lg mb-4 animate-bounce border border-cyan-200">
                      <Brain className="text-cyan-700" size={32} />
                    </div>
                    <p className="text-slate-700 font-bold text-xl mb-6 drop-shadow-sm">What is the empirical therapy?</p>
                    <button 
                      onClick={() => toggleReveal(infection.id)}
                      className="bg-cyan-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-[0_4px_14px_0_rgba(8,145,178,0.39)] hover:shadow-[0_6px_20px_rgba(8,145,178,0.23)] hover:scale-105"
                    >
                      Reveal Answer
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95 duration-300">
                    <div>
                      <p className="text-xs font-black text-cyan-700 uppercase tracking-widest mb-3">First Line Therapy</p>
                      <p className="font-bold text-slate-900 text-xl md:text-3xl leading-tight drop-shadow-sm">{rec.first || "Consult ID"}</p>
                      {rec.warning && (
                        <div className="mt-4 flex items-start space-x-3 text-xs text-rose-900 bg-rose-50 p-4 rounded-xl border border-rose-200 shadow-sm">
                          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-rose-600" />
                          <span className="font-bold text-sm">{rec.warning}</span>
                        </div>
                      )}
                    </div>
                    <div className="md:border-l md:border-slate-300/50 md:pl-8">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Alternatives</p>
                      <p className="text-slate-700 font-bold text-lg md:text-xl mb-4 leading-snug">{rec.alt || "None / Consult"}</p>
                      {rec.dur && (
                        <div className="inline-flex items-center space-x-2 bg-slate-50/80 px-4 py-2 rounded-lg border border-slate-200/60 text-slate-600 shadow-sm">
                          <Activity size={14} />
                          <span className="text-xs font-bold uppercase tracking-wide">Duration</span>
                          <span className="text-sm font-black text-slate-800">{rec.dur}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Notes */}
              {(infection.notes || (isTraineeMode && isRevealed)) && (
                <div className="mt-6 flex items-start space-x-3 text-sm text-slate-600 px-2 py-2 border-t border-slate-200/50">
                  <Info size={18} className="mt-0.5 text-cyan-600 flex-shrink-0" />
                  <span className="italic font-semibold">{infection.notes}</span>
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
      <div className="p-4 md:p-8 pb-4 bg-white/60 backdrop-blur-xl rounded-t-3xl border border-white/40 border-b-0 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">Antibiogram Data</h3>
            <p className="text-slate-600 font-bold mt-1">Susceptibility rates (%) for Central Ohio.</p>
          </div>
          <div className="flex items-center space-x-3 text-xs bg-white/60 p-3 rounded-xl border border-white/60 shadow-sm backdrop-blur-md self-start md:self-auto">
            <span className="flex items-center font-bold text-slate-700"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-1.5 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> &ge;90%</span>
            <span className="flex items-center font-bold text-slate-700"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full mr-1.5 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span> 75-89%</span>
            <span className="flex items-center font-bold text-slate-700"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full mr-1.5 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span> &lt;75%</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-b-3xl border border-white/40 shadow-2xl bg-white/30 backdrop-blur-md">
        <table className="w-full text-sm text-left border-collapse min-w-[600px]">
          <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white uppercase font-bold tracking-wider text-xs shadow-lg relative z-10">
            <tr>
              <th className="px-6 py-5">Organism</th>
              <th className="px-6 py-5">Antibiotic</th>
              <th className="px-6 py-5 text-center">% Susceptible</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {sortedData.map((row, idx) => (
              <tr key={idx} className="group hover:bg-white/60 transition-all duration-200 even:bg-white/10 odd:bg-white/20">
                <td className="px-6 py-4 font-black text-slate-800 group-hover:text-cyan-700 transition-colors drop-shadow-sm text-base">{row.organism}</td>
                <td className="px-6 py-4 text-slate-700 font-bold">{row.drug}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs tracking-wide transform group-hover:scale-110 transition-transform duration-200 ${getSusColor(row.sus)}`}>
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

const RenalHelper = () => (
  <Glass3DCard theme="cyan" className="bg-white/80">
    <div className="flex items-center mb-6">
      <div className="bg-orange-100 p-2 rounded-xl mr-3 text-orange-600 border border-orange-200 shadow-sm">
        <Activity size={24} />
      </div>
      <h3 className="text-2xl font-black text-slate-800 drop-shadow-sm">Renal Dosing Helper</h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200 shadow-inner">
        <div className="flex items-center space-x-2 mb-4">
           <Badge color="red">CrCl &lt; 30 mL/min</Badge>
        </div>
        <div className="space-y-3">
          {RENAL_LOGIC["eGFR<30"].map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row justify-between text-sm bg-white/80 p-4 rounded-xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="font-black text-slate-800 mb-1 sm:mb-0 text-base">{r.drug}</span>
              <span className="text-slate-700 sm:text-right font-semibold">{r.rule}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50/60 p-6 rounded-2xl border border-yellow-200 shadow-inner">
        <div className="flex items-center space-x-2 mb-4">
          <Badge color="yellow">CrCl 30 - 59 mL/min</Badge>
        </div>
        <div className="space-y-3">
          {RENAL_LOGIC["eGFR 30-59"].map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row justify-between text-sm bg-white/80 p-4 rounded-xl border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
              <span className="font-black text-slate-800 mb-1 sm:mb-0 text-base">{r.drug}</span>
              <span className="text-slate-700 sm:text-right font-semibold">{r.rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Glass3DCard>
);

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
      
      {/* GLOBAL BACKGROUND - BAZZITE CRYSTAL THEME */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-100 via-sky-100 to-blue-50 opacity-100 pointer-events-none"></div>
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      {/* Crystal Refraction Overlay */}
      <div className="fixed top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/10 to-transparent rotate-12 pointer-events-none z-0"></div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* FLOATING SIDEBAR */}
      <aside className={`
        fixed inset-y-4 left-4 z-40 w-72 
        bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl
        transform transition-all duration-300 ease-out
        md:relative md:inset-0 md:m-4 md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
        flex flex-col text-white
      `}>
        <div className="p-8 border-b border-white/10 flex items-center space-x-4">
          <div className="bg-cyan-500 p-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Beaker size={26} className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight text-white drop-shadow-md">ABX Atlas</h1>
            <p className="text-xs text-cyan-300 uppercase tracking-widest font-bold mt-0.5">Central Ohio</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
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
          <div className="pt-6 mt-4 border-t border-white/10">
            <p className="px-4 text-xs font-bold text-cyan-300 uppercase mb-3 tracking-wider">Tools</p>
            <NavItem 
              icon={AlertOctagon} 
              label="Renal Dosing" 
              active={activeView === 'renal'} 
              onClick={() => { setActiveView('renal'); setSidebarOpen(false); }} 
            />
          </div>
        </nav>

        <div className="p-4 m-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap size={18} className={isTraineeMode ? "text-cyan-300" : "text-slate-500"} />
              <span className="text-sm font-bold text-slate-200">Trainee Mode</span>
            </div>
            <button 
              onClick={() => setTraineeMode(!isTraineeMode)}
              className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${isTraineeMode ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-700'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isTraineeMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center font-medium">
            {isTraineeMode ? "Active Recall Enabled" : "Quick Reference Mode"}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Floating Glass Header */}
        <header className="px-4 py-2 md:px-8 md:py-4 flex-shrink-0 z-20">
          <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg px-4 py-3 md:px-6 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-3 text-slate-600 hover:text-cyan-600 md:hidden p-1 rounded-lg hover:bg-white/50 transition-colors">
                <Menu size={24} />
              </button>
              <h2 className="text-lg md:text-xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">{getHeaderTitle()}</h2>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              
              {/* Patient Context Switcher - Desktop */}
              {activeView === 'infections' && (
                <div className="hidden lg:flex items-center bg-white/50 p-1.5 rounded-xl border border-white/50 shadow-inner">
                  <button onClick={() => setPatientContext('standard')} className={`p-2 rounded-lg transition-all ${patientContext === 'standard' ? 'bg-white shadow-md text-cyan-600 font-bold' : 'text-slate-500 hover:bg-white/50'}`} title="Standard"><User size={18} /></button>
                  <button onClick={() => setPatientContext('icu')} className={`p-2 rounded-lg transition-all ${patientContext === 'icu' ? 'bg-white shadow-md text-red-600 font-bold' : 'text-slate-500 hover:bg-white/50'}`} title="ICU"><Activity size={18} /></button>
                  <button onClick={() => setPatientContext('transplant')} className={`p-2 rounded-lg transition-all ${patientContext === 'transplant' ? 'bg-white shadow-md text-purple-600 font-bold' : 'text-slate-500 hover:bg-white/50'}`} title="Transplant"><ShieldAlert size={18} /></button>
                  <button onClick={() => setPatientContext('peds')} className={`p-2 rounded-lg transition-all ${patientContext === 'peds' ? 'bg-white shadow-md text-green-600 font-bold' : 'text-slate-500 hover:bg-white/50'}`} title="Pediatrics"><Baby size={18} /></button>
                </div>
              )}

              {/* Search - Desktop */}
              {activeView !== 'dashboard' && activeView !== 'antibiogram' && activeView !== 'renal' && (
                <div className="relative hidden lg:block group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-cyan-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search protocols..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white/50 hover:bg-white focus:bg-white border border-transparent focus:border-cyan-300 rounded-xl text-sm focus:ring-4 focus:ring-cyan-100 w-64 transition-all outline-none font-medium shadow-inner"
                  />
                </div>
              )}
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-[0_4px_10px_rgba(6,182,212,0.4)] border-2 border-white cursor-pointer hover:scale-105 transition-transform text-sm md:text-base">
                MD
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sub-Header (Sticky) */}
        <div className="md:hidden px-4 pb-2 sticky top-0 z-10">
           {activeView === 'infections' && (
            <div className="flex justify-between bg-white/70 backdrop-blur-xl p-1.5 rounded-xl border border-white/40 mb-2 shadow-lg">
              <button onClick={() => setPatientContext('standard')} className={`flex-1 flex justify-center py-2 rounded-lg text-xs font-bold transition-all ${patientContext === 'standard' ? 'bg-white shadow-sm text-cyan-600 ring-1 ring-black/5' : 'text-slate-500'}`}>Std</button>
              <button onClick={() => setPatientContext('icu')} className={`flex-1 flex justify-center py-2 rounded-lg text-xs font-bold transition-all ${patientContext === 'icu' ? 'bg-white shadow-sm text-red-600 ring-1 ring-black/5' : 'text-slate-500'}`}>ICU</button>
              <button onClick={() => setPatientContext('transplant')} className={`flex-1 flex justify-center py-2 rounded-lg text-xs font-bold transition-all ${patientContext === 'transplant' ? 'bg-white shadow-sm text-purple-600 ring-1 ring-black/5' : 'text-slate-500'}`}>Tx</button>
              <button onClick={() => setPatientContext('peds')} className={`flex-1 flex justify-center py-2 rounded-lg text-xs font-bold transition-all ${patientContext === 'peds' ? 'bg-white shadow-sm text-green-600 ring-1 ring-black/5' : 'text-slate-500'}`}>Peds</button>
            </div>
          )}
           {activeView !== 'dashboard' && activeView !== 'antibiogram' && activeView !== 'renal' && (
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/80 backdrop-blur-md border border-white/50 rounded-xl text-sm w-full shadow-sm focus:ring-2 focus:ring-cyan-500/20 outline-none font-medium"
                />
              </div>
           )}
        </div>

        {/* Scrollable Content with Snap behavior */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth snap-y snap-mandatory lg:snap-none">
          <div className="max-w-7xl mx-auto pb-24 md:pb-20">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
