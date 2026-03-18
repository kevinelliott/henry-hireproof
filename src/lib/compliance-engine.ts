export interface ComplianceRequirement {
  id: string
  name: string
  description: string
  category: 'federal' | 'state' | 'company'
  required: boolean
  deadline?: string
  penalty: { amount: string; citation: string }
  completionType: 'signature' | 'upload' | 'form' | 'acknowledgment'
  gateOrder: number
}

export interface StateCompliance {
  state: string
  stateName: string
  requirements: ComplianceRequirement[]
  notes: string[]
}

const FEDERAL_REQUIREMENTS: ComplianceRequirement[] = [
  {
    id: 'fed-i9',
    name: 'I-9 Employment Eligibility Verification',
    description: 'USCIS Form I-9 must be completed by employer and employee. Employee must present acceptable documents proving identity and work authorization.',
    category: 'federal',
    required: true,
    deadline: 'Section 1 by first day; Section 2 within 3 business days of start',
    penalty: { amount: '$272–$2,701 per form (first offense); $2,701–$27,018 (repeat)', citation: 'INA §274A; 8 CFR §274a.10; 8 U.S.C. §1324a' },
    completionType: 'form',
    gateOrder: 1
  },
  {
    id: 'fed-w4',
    name: 'W-4 Federal Income Tax Withholding',
    description: 'IRS Form W-4 Employee\'s Withholding Certificate must be completed before or on first paycheck.',
    category: 'federal',
    required: true,
    deadline: 'Before or on date of first paycheck',
    penalty: { amount: '$500 civil penalty if employee claims false exemption; potential criminal liability', citation: 'IRC §3402; IRS Pub. 15-T' },
    completionType: 'form',
    gateOrder: 2
  },
  {
    id: 'fed-direct-deposit',
    name: 'Direct Deposit Authorization',
    description: 'Authorization form for payroll direct deposit including bank routing and account numbers.',
    category: 'federal',
    required: false,
    deadline: 'Before first paycheck',
    penalty: { amount: 'No federal penalty; state wage payment laws may apply', citation: 'FLSA; state wage payment statutes' },
    completionType: 'form',
    gateOrder: 3
  },
  {
    id: 'fed-handbook',
    name: 'Employee Handbook Acknowledgment',
    description: 'Signed acknowledgment that employee has received, read, and understands the employee handbook including company policies.',
    category: 'company',
    required: true,
    deadline: 'First day of employment',
    penalty: { amount: 'No direct penalty; critical for enforcement of policies and at-will doctrine', citation: 'Common law; NLRA §7; employment contract law' },
    completionType: 'acknowledgment',
    gateOrder: 4
  },
  {
    id: 'fed-emergency-contact',
    name: 'Emergency Contact Information',
    description: 'Employee must provide emergency contact name, relationship, and phone number(s).',
    category: 'company',
    required: true,
    deadline: 'First day of employment',
    penalty: { amount: 'No direct regulatory penalty; OSHA 1904 recordkeeping implications', citation: 'OSHA 29 CFR §1904' },
    completionType: 'form',
    gateOrder: 3
  },
  {
    id: 'fed-anti-harassment',
    name: 'Anti-Harassment & Discrimination Training Acknowledgment',
    description: 'Acknowledgment of anti-harassment policy covering Title VII, ADA, ADEA, and workplace conduct standards.',
    category: 'federal',
    required: true,
    deadline: 'Within 30 days of hire',
    penalty: { amount: 'Uncapped compensatory and punitive damages for employer liability under Title VII', citation: 'Title VII of Civil Rights Act (42 U.S.C. §2000e); ADA §503; ADEA' },
    completionType: 'acknowledgment',
    gateOrder: 5
  },
  {
    id: 'fed-osha',
    name: 'OSHA Workplace Safety Orientation',
    description: 'OSHA "It\'s the Law" workplace poster acknowledgment; job-specific hazard communication training per OSHA Hazcom standard.',
    category: 'federal',
    required: true,
    deadline: 'Before beginning work in potentially hazardous areas',
    penalty: { amount: '$16,131 per willful or repeat violation; $1,078–$16,131 serious violations', citation: 'OSH Act §17; 29 CFR §1910.1200; 29 CFR §1926' },
    completionType: 'acknowledgment',
    gateOrder: 5
  }
]

const STATE_DATA: Record<string, StateCompliance> = {
  AL: {
    state: 'AL', stateName: 'Alabama',
    requirements: [
      { id: 'al-atwill', name: 'At-Will Employment Notice', description: 'Written notice that employment is at-will and may be terminated by either party at any time with or without cause.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct statutory penalty; affects enforceability of policies', citation: 'Alabama at-will doctrine; Hoffmann-La Roche Inc. v. Campbell, 512 So.2d 725 (Ala. 1987)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'al-eworkers-comp', name: 'Workers\' Compensation Coverage Notice', description: 'Employer must provide written notice of workers\' compensation coverage and how to file a claim.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$100–$1,000 per violation; misdemeanor criminal liability', citation: 'Alabama Workers\' Compensation Act, Ala. Code §25-5-1 et seq.' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'al-everify', name: 'E-Verify Enrollment Acknowledgment', description: 'Alabama law (HB 56) requires all employers to use E-Verify. Employee acknowledges participation in program.', category: 'state', required: true, deadline: 'Within 3 business days of hire', penalty: { amount: 'Loss of business licenses; debarment from state contracts', citation: 'Ala. Code §31-13-9; Alabama Taxpayer and Citizen Protection Act' }, completionType: 'acknowledgment', gateOrder: 2 }
    ],
    notes: ['Alabama is an at-will employment state', 'E-Verify mandatory for all employers', 'No state income tax withholding form — use federal W-4']
  },
  AK: {
    state: 'AK', stateName: 'Alaska',
    requirements: [
      { id: 'ak-wage-notice', name: 'Wage and Hour Notice', description: 'Written notice of wage rate, pay period, payday, and method of payment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000 per violation', citation: 'Alaska Wage and Hour Act, AS §23.05.140' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ak-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' compensation carrier, policy number, and claim procedures.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Up to $1,000/day for operating without coverage', citation: 'AS §23.30.075; AS §23.30.080' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ak-atwill', name: 'At-Will Employment Acknowledgment', description: 'Notice that employment is at-will under Alaska law.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; implied contract exceptions apply', citation: 'Alaska at-will doctrine; Luedtke v. Nabors Alaska Drilling, 768 P.2d 1123 (Alaska 1989)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Alaska has its own minimum wage higher than federal', 'No E-Verify mandate for private employers', 'Alaska requires state withholding — use AK state form']
  },
  AZ: {
    state: 'AZ', stateName: 'Arizona',
    requirements: [
      { id: 'az-everify', name: 'E-Verify Enrollment Acknowledgment', description: 'Arizona law (Legal Arizona Workers Act) mandates E-Verify for ALL employers. Employee acknowledges verification.', category: 'state', required: true, deadline: 'Within 3 business days', penalty: { amount: 'Business license suspension (first violation), permanent revocation (second violation)', citation: 'A.R.S. §23-214; Legal Arizona Workers Act (2007)' }, completionType: 'acknowledgment', gateOrder: 2 },
      { id: 'az-wage-notice', name: 'Wage Payment Notice', description: 'Written notice of designated paydays and payment method per Arizona Wage Payment Act.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000+ civil penalties; treble damages for willful violations', citation: 'A.R.S. §23-351; Arizona Wage Payment Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'az-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' compensation coverage including carrier name and how to report injuries.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class 6 felony for failure to maintain coverage', citation: 'A.R.S. §23-961; A.R.S. §23-906' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Arizona mandates E-Verify for ALL employers regardless of size', 'Arizona minimum wage is $14.70/hour (2024)', 'Earned Paid Sick Time required under A.R.S. §23-372']
  },
  AR: {
    state: 'AR', stateName: 'Arkansas',
    requirements: [
      { id: 'ar-atwill', name: 'At-Will Employment Notice', description: 'Written acknowledgment of Arkansas at-will employment doctrine.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; affects policy enforcement', citation: 'Arkansas Right-to-Work Amendment; Arkansas Constitution Art. 19 §15' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ar-workers-comp', name: 'Workers\' Compensation Coverage Notice', description: 'Written notice of workers\' comp coverage, carrier, and claim procedures per Arkansas Workers\' Compensation Commission.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Employer liable for all injuries; $10,000 fine plus attorney fees', citation: 'Ark. Code Ann. §11-9-404; Ark. Code Ann. §11-9-407' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ar-wage-payment', name: 'Wage Payment Act Notice', description: 'Notice of payment frequency, method, and payday under Arkansas Wage Payment Act.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$500–$10,000 per violation; criminal misdemeanor', citation: 'Ark. Code Ann. §11-4-401 et seq.' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Arkansas is a right-to-work state', 'Arkansas minimum wage is $11.00/hour', 'New hire reporting required within 20 days to AR DWS']
  },
  CA: {
    state: 'CA', stateName: 'California',
    requirements: [
      { id: 'ca-wtpa', name: 'Wage Theft Prevention Act (WTPA) Notice', description: 'Written notice (DLSE Form NTE) containing: rate of pay, basis for pay, overtime rate, allowances, regular paydays, employer name and address, workers\' comp carrier. Required for non-exempt employees.', category: 'state', required: true, deadline: 'First day of employment', penalty: { amount: '$50–$4,000 per employee per violation', citation: 'California Labor Code §2810.5; IWC Wage Orders' }, completionType: 'form', gateOrder: 4 },
      { id: 'ca-pay-transparency', name: 'Pay Transparency Act Notice (SB 1162)', description: 'Disclosure of pay scale for the position. Employers with 15+ employees must include pay scale in job postings and provide pay scale to current employees on request.', category: 'state', required: true, deadline: 'At time of offer/hiring', penalty: { amount: '$100–$10,000 per violation', citation: 'California Labor Code §432.3; SB 1162 (2023)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ca-sexual-harassment', name: 'Sexual Harassment Prevention Training (SB 1343)', description: 'Supervisors: 2 hours of training within 6 months of hire. Non-supervisory employees: 1 hour within 6 months. Online training acceptable.', category: 'state', required: true, deadline: 'Within 6 months of hire date', penalty: { amount: 'DFEH enforcement action; injunctive relief; civil penalties', citation: 'California Government Code §12950.1; SB 1343 (2018); AB 1825' }, completionType: 'acknowledgment', gateOrder: 5 },
      { id: 'ca-calsavers', name: 'CalSavers Retirement Savings Acknowledgment', description: 'For employers with 5+ employees not offering qualified retirement plan: employees must be enrolled in CalSavers or opt out. Employee receives enrollment notice and opt-out rights.', category: 'state', required: true, deadline: 'Within 30 days of hire for eligible employees', penalty: { amount: '$250/employee penalty (non-compliant after 90 days); $500/employee (non-compliant after 180 days)', citation: 'Government Code §100033; CalSavers Retirement Savings Trust Act' }, completionType: 'acknowledgment', gateOrder: 5 },
      { id: 'ca-dfeh', name: 'DFEH Notice – Right to Sue & Workplace Rights', description: 'Distribution of DFEH-185P notice regarding workplace rights, discrimination protection, and right to sue under FEHA.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'FEHA civil liability; attorney fees; DFEH investigation', citation: 'California Government Code §12950; FEHA (Gov. Code §12900 et seq.)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ca-sick-leave', name: 'Paid Sick Leave Notice (SB 616)', description: 'Written notice of California paid sick leave rights: 5 days/40 hours accrual, usage terms, carryover rules. Required under Healthy Workplaces Healthy Families Act as amended by SB 616 (2024).', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$50–$4,000 per violation; treble damages for retaliation', citation: 'California Labor Code §245.5; SB 616 (2024); HWHFA' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ca-de4', name: 'DE-4 California Income Tax Withholding', description: 'California Employee\'s Withholding Allowance Certificate (EDD Form DE-4). Required for California income tax withholding separate from federal W-4.', category: 'state', required: true, deadline: 'Before first paycheck', penalty: { amount: 'Employer liable for incorrect withholding; FTB penalties apply', citation: 'California Revenue & Taxation Code §18661; EDD DE-4' }, completionType: 'form', gateOrder: 2 },
      { id: 'ca-workers-comp', name: 'Workers\' Compensation Rights & Notice', description: 'DWC-1 Form — Notice of workers\' compensation rights, including how to report injuries and employer\'s designated treating physician if any.', category: 'state', required: true, deadline: 'First day (within hiring paperwork)', penalty: { amount: '$10,000 fine; misdemeanor for willful failure to provide coverage', citation: 'California Labor Code §3550; Cal. Lab. Code §3700.5' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: [
      'California has the most comprehensive new hire documentation requirements in the US',
      'New hire reporting required within 20 days to California Employment Development Department',
      'California minimum wage is $16.00/hour (2024); industry-specific rates may be higher',
      'Non-compete agreements are void and unenforceable under Business & Professions Code §16600',
      'Meal and rest break requirements: 30-min meal break after 5 hours; 10-min rest for every 4 hours'
    ]
  },
  CO: {
    state: 'CO', stateName: 'Colorado',
    requirements: [
      { id: 'co-equal-pay', name: 'Equal Pay Transparency Notice (SB 19-085 / EPEWA)', description: 'Disclosure of compensation range for position, including hourly rate or salary range. Required for employers with 1+ Colorado employees under Equal Pay for Equal Work Act.', category: 'state', required: true, deadline: 'At time of offer', penalty: { amount: '$500–$10,000 per violation per employee', citation: 'C.R.S. §8-5-101 et seq.; SB 19-085; CDLE EPEWA Rules' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'co-famli', name: 'FAMLI (Family & Medical Leave Insurance) Notice', description: 'Notice of Colorado Paid Family & Medical Leave Insurance program: employee premium contributions, leave entitlements (12 weeks base, 16 for pregnancy complications), how to apply.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$50/day per employee for failure to notify; additional penalties for premium non-remittance', citation: 'C.R.S. §8-13.3-502; FAMLI Division rules; HB 23-1078' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'co-comps', name: 'COMPS Order #39 Notice (Colorado Overtime & Minimum Pay Standards)', description: 'Written notice or poster acknowledgment of COMPS Order #39 covering: Colorado minimum wage ($14.42/hr 2024), overtime rules, meal/rest periods, and tip credit rules.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000 per violation; civil penalties under Colorado Wage Claim Act', citation: 'COMPS Order #39; C.R.S. §8-6-118; Colorado Wage Claim Act §8-4-111' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'co-workers-comp', name: 'Workers\' Compensation Insurance Notice', description: 'Written notice of workers\' comp carrier, policy number, and how to report workplace injuries.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$500/day for operation without coverage; criminal liability', citation: 'C.R.S. §8-44-101; C.R.S. §8-43-409' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'co-paid-sick-leave', name: 'Colorado Healthy Families & Workplaces Act (HFWA) Notice', description: 'Notice of paid sick leave entitlement: 1 hour per 30 worked (up to 48 hours/year), permitted uses, non-retaliation rights.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalties up to $2,500 per violation; actual damages + attorney fees', citation: 'C.R.S. §8-13.3-405; HFWA (SB 20-205)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Colorado minimum wage: $14.42/hour (2024)', 'Non-compete agreements have strict enforceability limits under HB 22-1317', 'New hire reporting within 20 days to Colorado DOR']
  },
  CT: {
    state: 'CT', stateName: 'Connecticut',
    requirements: [
      { id: 'ct-fmla', name: 'CT Family & Medical Leave Act Notice (CT FMLA)', description: 'Notice of Connecticut PFML: up to 12 weeks paid leave for qualifying reasons, funded by employee payroll deduction of 0.5% wages. Coverage begins January 2022.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalties; CTDOL enforcement action; employee private right of action', citation: 'C.G.S. §31-49q; CT PFML Act (Public Act 19-25)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ct-wage-notice', name: 'Wage Payment Notice', description: 'Written notice of regular pay period, paydays, and employer contact information per CT wage payment statutes.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$300–$3,000 per violation', citation: 'C.G.S. §31-71b; CT Wage Payment Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ct-sexual-harassment', name: 'Sexual Harassment Prevention Training & Notice', description: 'Employers with 3+ employees must provide 2-hour interactive training within 6 months of hire. Distribute CHRO poster. Annual training for new supervisors.', category: 'state', required: true, deadline: 'Within 6 months of hire', penalty: { amount: 'CHRO enforcement; civil penalties; attorney fees', citation: 'C.G.S. §46a-54(15)(B); An Act Concerning the Pretrial Diversionary Program (2019)' }, completionType: 'acknowledgment', gateOrder: 5 }
    ],
    notes: ['Connecticut has state income tax — use CT-W4 in addition to federal W-4', 'New hire reporting within 20 days to CT DSS', 'Minimum wage: $15.69/hour (2024)']
  },
  DE: {
    state: 'DE', stateName: 'Delaware',
    requirements: [
      { id: 'de-wage-notice', name: 'Wage Payment & Collection Act Notice', description: 'Written notice of pay rate, pay period, payday and employer name/address.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000–$5,000 per violation; civil penalty', citation: 'Del. Code Ann. tit. 19, §1101 et seq.; Delaware Wage Payment & Collection Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'de-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' comp coverage, reporting requirements, and employee rights.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Up to $10,000 fine; Class A misdemeanor for failure to maintain coverage', citation: 'Del. Code Ann. tit. 19, §2322' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Delaware minimum wage: $13.25/hour (2024)', 'Delaware state income tax: use DE Form W-4A', 'New hire reporting within 20 days to DE DOL']
  },
  DC: {
    state: 'DC', stateName: 'Washington D.C.',
    requirements: [
      { id: 'dc-wage-notice', name: 'D.C. Wage Notice (WPCA)', description: 'Written notice at hire: pay rate, pay basis, overtime rate, allowances, employer name/address/phone, work location. Required under DC Wage Payment and Collection Act.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000 per violation; private right of action; attorney fees', citation: 'D.C. Code §32-1008; DC WPCA' }, completionType: 'form', gateOrder: 4 },
      { id: 'dc-universal-paid-leave', name: 'DC Universal Paid Leave (DCUPL) Notice', description: 'Notice of DC Universal Paid Leave Act: up to 12 weeks paid family, 12 weeks medical, 2 weeks prenatal leave. Funded by 0.62% employer payroll tax.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$100/day for failure to post/notify; additional penalties for non-compliance', citation: 'D.C. Code §32-541.01 et seq.; Universal Paid Leave Amendment Act of 2016' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'dc-accrued-sick-leave', name: 'DC Accrued Safe & Sick Leave Notice', description: 'Notice of DC Accrued Sick and Safe Leave Act rights: 1 hour per 37 hours worked (employers <25 employees); 1 per 43 hours (25-99 employees); 1 per 87 hours (100+ employees).', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil fines of $500–$1,000 per violation per employee', citation: 'D.C. Code §32-531.02; Accrued Sick and Safe Leave Act of 2008' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'dc-sexual-harassment', name: 'DC Sexual Harassment Notice & Training', description: 'Notice of DC Human Rights Act protections; employers with tipped employees must provide sexual harassment training within 90 days.', category: 'state', required: true, deadline: 'Within 90 days of hire', penalty: { amount: 'DC OHR enforcement; civil liability under DCHRA; up to $150,000 in damages', citation: 'D.C. Code §2-1402.11; DCHRA; Tipped Workers Fairness Amendment Act' }, completionType: 'acknowledgment', gateOrder: 5 }
    ],
    notes: ['DC minimum wage: $17.50/hour (2024)', 'One of the strongest worker protection jurisdictions in the US', 'DC income tax: use D-4 Employee Withholding Allowance Certificate']
  },
  FL: {
    state: 'FL', stateName: 'Florida',
    requirements: [
      { id: 'fl-atwill', name: 'At-Will Employment Acknowledgment', description: 'Written acknowledgment that Florida employment is at-will; either party may terminate at any time with or without cause or notice unless an agreement provides otherwise.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct statutory penalty; critical for enforcing at-will doctrine', citation: 'Florida at-will doctrine; DeMarco v. Publix Super Markets, 360 So. 2d 134 (Fla. 1978)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'fl-everify', name: 'E-Verify Enrollment (SB 1718)', description: 'Florida law (SB 1718, effective July 2023) requires ALL employers with 25+ employees to use E-Verify for all new hires. Employee acknowledges participation.', category: 'state', required: true, deadline: 'Before start of employment', penalty: { amount: 'License suspension; $1,000/day for continuing violation; debarment from state contracts for 1 year', citation: 'Fla. Stat. §448.095; SB 1718 (2023)' }, completionType: 'acknowledgment', gateOrder: 2 },
      { id: 'fl-workers-comp', name: 'Workers\' Compensation Coverage Notice', description: 'Notice of workers\' comp coverage, carrier information, and injury reporting procedures. Most employers with 4+ employees required to carry.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Stop-work order; penalty of 1.5x two-year premiums for failure to carry', citation: 'Fla. Stat. §440.38; Fla. Stat. §440.107' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'fl-payday-notice', name: 'Florida Payday Law Notice', description: 'Written notice of regular paydays, method of payment, and employer contact information.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty up to $1,000; criminal misdemeanor', citation: 'Fla. Stat. §448.01; Florida Wage Payment Statutes' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Florida minimum wage: $13.00/hour (2024)', 'No Florida state income tax — no state withholding form needed', 'New hire reporting within 20 days to Florida New Hire Reporting Center']
  },
  GA: {
    state: 'GA', stateName: 'Georgia',
    requirements: [
      { id: 'ga-everify', name: 'E-Verify Enrollment (O.C.G.A. §13-10-91)', description: 'Georgia law requires all private employers with 11+ employees to use E-Verify. Public employers of any size required. Employee acknowledges verification participation.', category: 'state', required: true, deadline: 'Before start of employment', penalty: { amount: 'Loss of business license; debarment from public contracts; civil penalties', citation: 'O.C.G.A. §13-10-91; O.C.G.A. §36-60-6; Georgia Security and Immigration Compliance Act' }, completionType: 'acknowledgment', gateOrder: 2 },
      { id: 'ga-workers-comp', name: 'Workers\' Compensation Notice (Form WC-P1)', description: 'State Board of Workers\' Compensation Panel of Physicians posting and notice to employee of their right to choose from employer\'s posted panel of physicians for treatment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Employer loses right to control medical treatment; employee can choose own physician', citation: 'O.C.G.A. §34-9-201; O.C.G.A. §34-9-223; Georgia Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ga-atwill', name: 'At-Will Employment Notice', description: 'Georgia is strictly at-will. Written acknowledgment protects employer\'s right to terminate without cause.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; affects wrongful termination claims', citation: 'O.C.G.A. §34-7-1; Georgia at-will doctrine' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Georgia minimum wage is $5.15/hour — federal rate of $7.25 applies to most employees', 'No state income tax withholding form separate from W-4 for most', 'Georgia has strong non-compete enforcement (O.C.G.A. §13-8-53)']
  },
  HI: {
    state: 'HI', stateName: 'Hawaii',
    requirements: [
      { id: 'hi-wage-notice', name: 'Wage Payment Notice (HRS §388-7)', description: 'Written statement of wage rate, method of payment, and paydays. Must include any deductions.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$500 per violation; civil penalties under HRS §388', citation: 'Hawaii Revised Statutes §388-7; Hawaii Wage Payment Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'hi-pfml', name: 'Hawaii Paid Family Leave Notice (TDI + PFML)', description: 'Notice of Hawaii Temporary Disability Insurance (TDI) and Family Leave Law (FLL): 58% wage replacement for disability, 4 weeks unpaid family leave. Employee TDI contribution of 0.5% wages.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Up to $2,000 per violation; DLIR enforcement action', citation: 'HRS §392-21; HRS §398-1 et seq.; Hawaii Family Leave Law' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'hi-prepaid-health', name: 'Prepaid Health Care Act Notice', description: 'Hawaii is the ONLY state with mandatory employer-sponsored health insurance. Employers must provide health coverage to employees working 20+ hours/week for 4+ consecutive weeks. Employee notice of coverage and enrollment rights.', category: 'state', required: true, deadline: 'Within 30 days of eligibility (20 hours/week for 4 weeks)', penalty: { amount: '$25/day per employee; civil action; DLIR investigation', citation: 'HRS §393-11; Hawaii Prepaid Health Care Act (1974)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Hawaii minimum wage: $14.00/hour (2024)', 'Hawaii has mandatory employer health insurance — unique in the US', 'Hawaii state income tax: use HW-4 form']
  },
  ID: {
    state: 'ID', stateName: 'Idaho',
    requirements: [
      { id: 'id-atwill', name: 'At-Will Employment Notice', description: 'Idaho is a strong at-will state. Written acknowledgment of at-will status.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; supports enforcement of at-will doctrine', citation: 'Idaho at-will doctrine; Metcalf v. Intermountain Gas Co., 116 Idaho 622 (1989)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'id-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' comp coverage through Idaho Industrial Commission or state fund.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '72 times weekly payroll for failure to maintain coverage; misdemeanor', citation: 'Idaho Code §72-301 et seq.; Idaho Workers\' Compensation Law' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Idaho minimum wage equals federal: $7.25/hour', 'Idaho state income tax: use Idaho Form ID W-4', 'No state-mandated paid leave requirements']
  },
  IL: {
    state: 'IL', stateName: 'Illinois',
    requirements: [
      { id: 'il-workplace-transparency', name: 'Workplace Transparency Act Notice (SB 75)', description: 'Written notice of employee rights under Illinois Workplace Transparency Act: prohibition on non-disclosure agreements for harassment/discrimination, limitation of arbitration provisions, employer policy on reporting channels.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'IDOL enforcement; civil penalties; private right of action', citation: '820 ILCS 96/1-15; Illinois Workplace Transparency Act (SB 75, 2019)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'il-wage-payment', name: 'Illinois Wage Payment & Collection Act Notice', description: 'Written notice of pay rate, pay day and period, allowances/deductions. Notice must be provided before or on first paycheck.', category: 'state', required: true, deadline: 'Before first paycheck', penalty: { amount: '2% penalty per month on underpayments; $100–$1,000/day civil penalty', citation: '820 ILCS 115/1 et seq.; Illinois WPCA' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'il-one-day-rest', name: 'Illinois One Day Rest in Seven Act (ODRISA) Notice', description: 'Notice of employee rights to one day of rest in seven (24-hour period), and at least 20-minute meal period every 7.5 hours worked.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$500–$1,000 per violation', citation: '820 ILCS 140/1; Illinois ODRISA' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'il-sexual-harassment', name: 'Illinois Human Rights Act – Sexual Harassment Notice & Training', description: 'Annual sexual harassment prevention training required under ILHR Act amendment (SB 75). Must include: definition, examples, remedies, federal/state laws. Annual thereafter.', category: 'state', required: true, deadline: 'Within 1 year of hire; annually thereafter', penalty: { amount: 'IDHR civil penalty up to $5,000 per violation per year; investigation; civil action', citation: '775 ILCS 5/2-109; 775 ILCS 5/2-102(D); IHRA (775 ILCS 5/)' }, completionType: 'acknowledgment', gateOrder: 5 },
      { id: 'il-bipa', name: 'Illinois BIPA Consent Form (If Biometric Data Collected)', description: 'If employer collects biometric data (fingerprints for time clocks, facial recognition, etc.): written informed consent required BEFORE collection. Must disclose purpose, retention schedule, and third-party sharing.', category: 'state', required: false, deadline: 'Before any biometric data collection', penalty: { amount: '$1,000 per negligent violation; $5,000 per intentional/reckless violation (per occurrence)', citation: '740 ILCS 14/1 et seq.; Illinois Biometric Information Privacy Act (BIPA, 2008)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Illinois minimum wage: $14.00/hour (2024); increases to $15.00 January 1, 2025', 'New hire reporting within 20 days to Illinois DOE', 'Non-competes void for employees earning < $75,000/year under SB 672']
  },
  IN: {
    state: 'IN', stateName: 'Indiana',
    requirements: [
      { id: 'in-atwill', name: 'At-Will Employment Notice', description: 'Indiana is a strong at-will state. Written acknowledgment supports enforcement of at-will doctrine.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty', citation: 'Indiana at-will doctrine; Orr v. Westminster Village North, Inc., 689 N.E.2d 712 (Ind. 1997)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'in-workers-comp', name: 'Workers\' Compensation Notice', description: 'Written notice of workers\' comp coverage, carrier, and claim procedures. Most employers with 2+ employees required to carry.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil and criminal liability; Class D felony for willful non-compliance', citation: 'Ind. Code §22-3-5-1; Indiana Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Indiana minimum wage equals federal: $7.25/hour', 'Indiana state income tax: use Indiana WH-4 form', 'No state-mandated paid sick leave']
  },
  IA: {
    state: 'IA', stateName: 'Iowa',
    requirements: [
      { id: 'ia-atwill', name: 'At-Will Employment Notice', description: 'Iowa employment at-will acknowledgment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty', citation: 'Iowa at-will doctrine; Fogel v. Tompkins, 413 N.W.2d 541 (Iowa 1987)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ia-workers-comp', name: 'Workers\' Compensation Notice', description: 'Written notice of workers\' compensation coverage, carrier, and claims procedure.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000/day for failure to maintain coverage; personal liability for employers', citation: 'Iowa Code §87.22; Iowa Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Iowa minimum wage: $7.25/hour (federal rate)', 'Iowa state income tax withheld using IA W-4', 'New hire reporting required within 15 days to Iowa Workforce Development']
  },
  KS: {
    state: 'KS', stateName: 'Kansas',
    requirements: [
      { id: 'ks-atwill', name: 'At-Will Employment Notice', description: 'Kansas at-will employment doctrine acknowledgment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; supports enforcement', citation: 'K.S.A. §44-808; Kansas at-will doctrine' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ks-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of Kansas workers\' comp coverage. Required for employers with 1+ employees earning > $20,000/year.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Liable for all employee injuries; Class A misdemeanor', citation: 'K.S.A. §44-532; Kansas Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Kansas minimum wage: $7.25/hour (federal rate)', 'Kansas state income tax: use K-4 form', 'No state-mandated paid leave']
  },
  KY: {
    state: 'KY', stateName: 'Kentucky',
    requirements: [
      { id: 'ky-wage-notice', name: 'Kentucky Wage & Hour Notice', description: 'Written notice of pay rate, pay period, designated payday, and employer contact.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$100–$1,000 per violation', citation: 'KRS §337.070; Kentucky Wages & Hours Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ky-workers-comp', name: 'Workers\' Compensation Coverage Notice', description: 'Notice of workers\' comp coverage and employee rights under Kentucky law.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class D felony for willful failure; civil penalty', citation: 'KRS §342.340; KRS §342.990; Kentucky Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Kentucky minimum wage: $7.25/hour (federal rate)', 'Kentucky state income tax: use K-4 form', 'Kentucky is a right-to-work state']
  },
  LA: {
    state: 'LA', stateName: 'Louisiana',
    requirements: [
      { id: 'la-wage-notice', name: 'Louisiana Wage Payment Notice', description: 'Written notice of pay rate, pay schedule, and employer information per Louisiana Wage Payment Act.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$500–$5,000 per violation; up to 90 days imprisonment for willful violations', citation: 'La. R.S. 23:631 et seq.; Louisiana Wage Payment Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'la-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of Louisiana workers\' comp coverage and employee rights.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Criminal penalties; civil liability for all workplace injuries', citation: 'La. R.S. 23:1168 et seq.; Louisiana Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Louisiana minimum wage: $7.25/hour (federal rate)', 'Louisiana state income tax: use L-4 withholding certificate', 'New hire reporting required to Louisiana DOL within 20 days']
  },
  ME: {
    state: 'ME', stateName: 'Maine',
    requirements: [
      { id: 'me-earned-employee-leave', name: 'Maine Earned Employee Leave Notice', description: 'Maine was FIRST state with universal paid leave: employers with 10+ employees must provide 1 hour per 40 hours worked (max 40 hours/year) for any reason. Notice of accrual, use rights, and non-retaliation.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $100–$1,000 per violation; MDOL enforcement', citation: '26 M.R.S.A. §637; Maine Earned Employee Leave Act (LD 369, 2019)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'me-wage-notice', name: 'Maine Wage Notice', description: 'Written notice of pay rate, pay period, and paydays.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$100–$500 per violation', citation: '26 M.R.S.A. §621-A; Maine Wage & Hour Law' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Maine minimum wage: $14.15/hour (2024)', 'Maine state income tax: use Maine Form W-4ME', 'Maine was first state to enact universal paid leave']
  },
  MD: {
    state: 'MD', stateName: 'Maryland',
    requirements: [
      { id: 'md-time-to-care', name: 'Maryland FAMLI (Time to Care Act) Notice', description: 'Notice of Maryland Family and Medical Leave Insurance program: up to 12 weeks paid leave (24 for bonding + care needs). Employee contributes 0.45% of wages. Benefits begin January 2026.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Penalties for failure to make contributions; DLLR enforcement', citation: 'Md. Code Ann., Lab. & Empl. §8.3-101 et seq.; Time to Care Act of 2022; SB 275' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'md-wage-notice', name: 'Maryland Wage Payment & Collection Law Notice', description: 'Notice of pay rate, pay period, pay method, and employer contact per Maryland Wage Payment & Collection Law.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Treble damages + attorney fees; $1,000–$5,000 civil penalty', citation: 'Md. Code Ann., Lab. & Empl. §3-505; MWPCL' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'md-sick-safe-leave', name: 'Maryland Healthy Working Families Act Notice', description: 'Notice of Maryland earned sick and safe leave: 1 hour per 30 hours worked (up to 40 hours) for employers with 15+ employees; paid sick leave; 64 hours for employers with <15 employees.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $500–$5,000 per violation', citation: 'Md. Code Ann., Lab. & Empl. §3-1308; Maryland Healthy Working Families Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Maryland minimum wage: $15.00/hour (2024)', 'Maryland state income tax: use MW507 Employee Withholding Exemption Certificate', 'Baltimore City has additional local requirements']
  },
  MA: {
    state: 'MA', stateName: 'Massachusetts',
    requirements: [
      { id: 'ma-wage-act', name: 'Massachusetts Wage Act Notice (MGL c.149 §148)', description: 'Written notice of pay rate, pay period, and payday. Massachusetts Wage Act requires weekly payment (bi-weekly allowed with DOLS consent). Notice of all wage rights.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Treble damages; attorney fees; criminal prosecution for willful violations', citation: 'MGL c.149 §148; MGL c.149 §150; Massachusetts Wage Act' }, completionType: 'form', gateOrder: 4 },
      { id: 'ma-pfml', name: 'Massachusetts PFML Notice', description: 'Notice of Massachusetts Paid Family & Medical Leave: up to 12 weeks family leave, 20 weeks medical leave. Employee contributes 0.88% (0.46% medical, 0.11% family) of wages up to SSDI cap.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $1,000 per employee not notified; DFML enforcement', citation: 'MGL c.175M; PFML Act (2018); 458 CMR 2.00' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ma-earned-sick-time', name: 'Massachusetts Earned Sick Time Notice (MGL c.149 §148C)', description: 'Notice of earned sick time: employers with 11+ employees provide paid sick time; 1 hour per 30 worked (up to 40 hours). Smaller employers must provide unpaid sick time.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Treble damages + attorney fees; civil enforcement by AG', citation: 'MGL c.149 §148C; Massachusetts Earned Sick Time Law (2015)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ma-pay-transparency', name: 'Massachusetts Pay Transparency Act Notice', description: 'As of 2025 (effective for employers with 25+ employees): pay range disclosure required for job postings and to employees upon request or promotion.', category: 'state', required: true, deadline: 'At offer/hire', penalty: { amount: '$500 first violation; $1,000 second; $7,500 third violation', citation: 'MGL c.149 §105A; Massachusetts Pay Transparency Act (2024, effective Feb 2025)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ma-sexual-harassment', name: 'Massachusetts Sexual Harassment Policy (MGL c.151B §3A)', description: 'Employer must have written sexual harassment policy and provide to all employees. Policy must include definition, reporting procedure, investigation process.', category: 'state', required: true, deadline: 'First day (for employers with 6+ employees)', penalty: { amount: 'MCAD enforcement; civil liability; attorney fees; damages', citation: 'MGL c.151B §3A; Massachusetts MCAD Guidelines' }, completionType: 'acknowledgment', gateOrder: 5 }
    ],
    notes: ['Massachusetts minimum wage: $15.00/hour (2024)', 'Massachusetts state income tax: use M-4 Employee Withholding Exemption Certificate', 'Non-compete agreements: limited enforceability under Massachusetts Noncompete Agreement Act (2018)']
  },
  MI: {
    state: 'MI', stateName: 'Michigan',
    requirements: [
      { id: 'mi-paid-sick-leave', name: 'Michigan Earned Sick Time Act (ESTA) Notice', description: 'Notice of Michigan ESTA (effective 2025): all employees accrue 1 hour per 30 hours worked; employers with 10+ employees provide up to 72 hours paid sick time per year. Effective February 21, 2025.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil fines $1,000–$10,000 per violation; DLEG enforcement', citation: 'MCLA §408.961 et seq.; Michigan ESTA (as amended by Promote the Vote); 2024 Supreme Court ruling' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'mi-wage-notice', name: 'Michigan Wages & Hours Notice (WOWA)', description: 'Notice of pay rate, method of payment, and paydays. Michigan requires semi-monthly pay minimum.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000 per violation; civil and criminal penalties', citation: 'MCLA §408.471 et seq.; Michigan Workforce Opportunity Wage Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Michigan minimum wage: $10.33/hour (2024); increases to $12.48/hour July 2024', 'Michigan state income tax: use MI W-4 form', 'Michigan COVID-era ESTA amendments took effect February 2025 — verify current rates']
  },
  MN: {
    state: 'MN', stateName: 'Minnesota',
    requirements: [
      { id: 'mn-earned-sick-leave', name: 'Minnesota Earned Sick and Safe Time (ESST) Notice', description: 'Notice of Minnesota ESST (effective January 1, 2024): all employers provide 1 hour per 30 hours worked (up to 48 hours/year). Can be used for employee/family illness, safety, or school events.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $1,000 per violation; double damages for retaliation; DLI enforcement', citation: 'Minn. Stat. §181.9445 et seq.; MN ESST Act (2023)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'mn-wage-notice', name: 'Minnesota Wage Notice (Minn. Stat. §181.032)', description: 'Written notice at hire and changes: pay rate, overtime rate, pay period, payday, employer name, physical/mailing address, and telephone number. Notice in employee\'s primary language if possible.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $500 per violation per employee; private right of action', citation: 'Minn. Stat. §181.032; MN Labor Standards Act' }, completionType: 'form', gateOrder: 4 },
      { id: 'mn-pfml', name: 'Minnesota PFML Notice (Effective Jan 1, 2026)', description: 'Notice of MN PFML program launching January 2026: up to 12 weeks medical + 12 weeks family (20 total). Funded by employee/employer contributions (combined ~0.7% wages).', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'DLI enforcement; civil penalties for non-compliance with premium payments', citation: 'Minn. Stat. §268B; MN PFML Act (HF2 2023)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Minnesota minimum wage: $10.85/hour (large employers), $8.85/hour (small employers) — 2024', 'Minneapolis and St. Paul have higher local minimum wages', 'Minnesota state income tax: use MN Form W-4MN']
  },
  MS: {
    state: 'MS', stateName: 'Mississippi',
    requirements: [
      { id: 'ms-atwill', name: 'At-Will Employment Notice', description: 'Mississippi strictly at-will. Written acknowledgment of at-will employment status.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; supports at-will doctrine', citation: 'Mississippi at-will doctrine; Perry v. Sears, Roebuck & Co., 508 So.2d 1086 (Miss. 1987)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ms-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' comp coverage for employers with 5+ employees. Carrier information and claims procedure.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil and criminal penalties; personal liability for all injuries', citation: 'Miss. Code Ann. §71-3-5 et seq.; Mississippi Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Mississippi minimum wage: $7.25/hour (federal rate)', 'No state income tax on wages as of 2023 (phasing out)', 'Mississippi has no state-mandated paid leave requirements']
  },
  MO: {
    state: 'MO', stateName: 'Missouri',
    requirements: [
      { id: 'mo-wage-notice', name: 'Missouri Wage Payment Notice', description: 'Written notice of designated paydays and pay period under Missouri Wage Payment Act.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $50/day per violation', citation: 'Mo. Rev. Stat. §290.080 et seq.; Missouri Wage Payment Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'mo-workers-comp', name: 'Workers\' Compensation Coverage Notice', description: 'Notice of workers\' comp coverage. Required for employers with 5+ employees (construction: 1+).', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class D felony; $50,000 fine for failure to maintain coverage', citation: 'Mo. Rev. Stat. §287.280; Mo. Rev. Stat. §287.390; Missouri Workers\' Compensation Law' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Missouri minimum wage: $12.30/hour (2024)', 'Missouri state income tax: use MO W-4 form', 'Kansas City and St. Louis may have additional local requirements']
  },
  MT: {
    state: 'MT', stateName: 'Montana',
    requirements: [
      { id: 'mt-wrongful-discharge', name: 'Montana Wrongful Discharge From Employment Act (WDEA) Notice', description: 'UNIQUE: Montana is the ONLY US state that prohibits at-will termination after a probationary period. Notice must include: probationary period length (default 6 months), good cause required for discharge after probation ends.', category: 'state', required: true, deadline: 'First day; specify probationary period explicitly', penalty: { amount: '4 years\' lost wages + fringe benefits (no punitive damages)', citation: 'Mont. Code Ann. §39-2-901 et seq.; Montana WDEA (1987)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'mt-wage-notice', name: 'Montana Wage Payment Act Notice', description: 'Written notice of pay rate, pay period, and paydays.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$500 per violation', citation: 'Mont. Code Ann. §39-3-206; Montana Wage Payment Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Montana minimum wage: $10.30/hour (2024)', 'CRITICAL: Montana is NOT at-will after probationary period — must specify probation dates', 'Montana state income tax: use MT Form MW-4']
  },
  NE: {
    state: 'NE', stateName: 'Nebraska',
    requirements: [
      { id: 'ne-wage-payment', name: 'Nebraska Wage Payment Act Notice', description: 'Written notice of regular paydays and pay period.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$100 per violation; civil penalty', citation: 'Neb. Rev. Stat. §48-1228 et seq.; Nebraska Wage Payment & Collection Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ne-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' comp coverage. Nebraska requires all employers with 1+ employees.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class IV felony; civil liability', citation: 'Neb. Rev. Stat. §48-145; Nebraska Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Nebraska minimum wage: $12.00/hour (2024)', 'Nebraska state income tax: use Nebraska Form W-4N', 'New hire reporting within 20 days to Nebraska DOR']
  },
  NV: {
    state: 'NV', stateName: 'Nevada',
    requirements: [
      { id: 'nv-wage-notice', name: 'Nevada Wage Notice (NRS §608.018)', description: 'Written notice at time of hire: rate of pay, method of payment, how and when employee will be paid, designated place of wage payment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$5,000 per violation; civil penalty plus attorney fees', citation: 'NRS §608.018; NRS §608.015; Nevada Minimum Wage Act' }, completionType: 'form', gateOrder: 4 },
      { id: 'nv-paid-leave', name: 'Nevada Paid Leave Notice (SB 312)', description: 'Nevada SB 312: employers with 50+ employees must provide 0.01923 hours of paid leave per hour worked (up to 40 hours). Can be used for any reason — no cause required.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$5,000 civil penalty per violation; NERC enforcement', citation: 'NRS §608.0197; Nevada SB 312 (2019)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'nv-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of Nevada workers\' comp coverage, carrier, and employee rights.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Up to $15,000 fine; misdemeanor for failure to provide coverage', citation: 'NRS §616A.020 et seq.; Nevada Industrial Insurance Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Nevada minimum wage: $12.00/hour (2024)', 'No state income tax in Nevada — no state withholding form needed', 'Las Vegas and Clark County may have additional ordinances']
  },
  NH: {
    state: 'NH', stateName: 'New Hampshire',
    requirements: [
      { id: 'nh-wage-notice', name: 'New Hampshire Wage Notice (RSA 275:53)', description: 'Written notice of pay rate, pay period, and designated payday. Must be provided before work begins.', category: 'state', required: true, deadline: 'Before work begins', penalty: { amount: '$100–$1,000 per violation; civil penalty', citation: 'RSA 275:53; RSA 275:43; NH Protective Legislation Law' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'nh-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' comp coverage and employee rights.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class B misdemeanor; civil liability', citation: 'RSA 281-A:5; NH Workers\' Compensation Law' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['New Hampshire minimum wage: $7.25/hour (federal rate)', 'No state income tax on wages (only dividends/interest — phasing out)', 'No state-mandated paid family leave program currently']
  },
  NJ: {
    state: 'NJ', stateName: 'New Jersey',
    requirements: [
      { id: 'nj-wage-theft', name: 'NJ Wage Theft Prevention Notice', description: 'Written notice (NJDOL Form MW-400-IP) at hire: regular pay rate, overtime rate, pay basis, allowances, paydays, employer name and address, main office telephone. Must be signed by employee.', category: 'state', required: true, deadline: 'First day of employment', penalty: { amount: 'Up to $500 per violation per employee; civil penalty plus attorney fees', citation: 'N.J.S.A. §34:11-4.1 et seq.; N.J.A.C. 12:56-1; NJ Wage Theft Act (2019)' }, completionType: 'form', gateOrder: 4 },
      { id: 'nj-pfml', name: 'New Jersey Family Leave Insurance (FLI) Notice', description: 'Notice of NJ FLI: up to 12 weeks paid family leave at 85% of wages (up to 70% of state AWW). Funded by 0.09% employee contribution. Also: NJ TDI for own illness.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $250–$2,500; NJDOL enforcement', citation: 'N.J.S.A. §43:21-39.1; NJ FLA; NJ TDI law' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'nj-earned-sick-leave', name: 'NJ Earned Sick Leave Act Notice', description: 'Notice of NJ ESL: 1 hour per 30 hours worked (up to 40 hours/year) for ALL employers. Can use for illness, domestic abuse, public health emergencies.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Administrative fine $100–$1,000 per violation; civil penalties', citation: 'N.J.S.A. §34:11D-1 et seq.; NJ Earned Sick Leave Act (2018)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'nj-pay-equity', name: 'NJ Pay Equity Notice (Diane B. Allen Equal Pay Act)', description: 'Notice of NJ Equal Pay Act: prohibits pay discrimination based on protected class; employer must provide pay range on request.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Treble damages + civil penalties; 6-year limitations period', citation: 'N.J.S.A. §34:11-56.11; Diane B. Allen Equal Pay Act (2018)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['New Jersey minimum wage: $15.49/hour (2024)', 'NJ state income tax: use NJ-W4 Employee Withholding Certificate', 'NJ has some of the strongest worker protection laws in the US']
  },
  NM: {
    state: 'NM', stateName: 'New Mexico',
    requirements: [
      { id: 'nm-healthy-workplaces', name: 'New Mexico Healthy Workplaces Act Notice', description: 'Notice of NM paid sick leave (effective 2022): 1 hour per 30 hours worked (up to 64 hours/year) for ALL employers, regardless of size.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $500 per violation; NMDOL enforcement', citation: 'NMSA 1978 §50-17-1 et seq.; New Mexico Healthy Workplaces Act (2021)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'nm-wage-notice', name: 'New Mexico Wage Notice', description: 'Written notice of pay rate, method, and paydays per NM Wage Payment Act.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$500 per violation', citation: 'NMSA 1978 §50-4-2; New Mexico Wage Payment Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['New Mexico minimum wage: $12.00/hour (2024)', 'New Mexico state income tax: use RPD-41283 withholding form', 'Albuquerque has higher local minimum wage: $12.00/hour']
  },
  NY: {
    state: 'NY', stateName: 'New York',
    requirements: [
      { id: 'ny-wtpa', name: 'New York WTPA Notice (LS 54/LS 59)', description: 'Wage Theft Prevention Act notice: pay rate (regular and overtime), pay basis (hour/day/week/piece), allowances claimed, paydays, employer name, DBA, physical address, and phone number. Use NYDOL Form LS 54 (non-exempt) or LS 59 (exempt). Must be signed; kept on file 6 years.', category: 'state', required: true, deadline: 'Before first paycheck; also at any pay rate change', penalty: { amount: 'Damages of $50/day per employee (max $5,000); civil/criminal enforcement', citation: 'NY Labor Law §195(1); WTPA (2011, amended 2015); 12 NYCRR §195-1.1' }, completionType: 'form', gateOrder: 4 },
      { id: 'ny-sexual-harassment', name: 'NY Sexual Harassment Prevention Training (§201-g)', description: 'Annual interactive sexual harassment training required for ALL employees. Training must meet or exceed state model. Employee must receive written policy and complaint form. Annual training.', category: 'state', required: true, deadline: 'Within 30 days of hire; annually thereafter', penalty: { amount: 'NYDHR investigation; civil liability; unlimited damages under NYSHRL', citation: 'NY Labor Law §201-g; NY Exec. Law §296; NYDHR rules' }, completionType: 'acknowledgment', gateOrder: 5 },
      { id: 'ny-paid-family-leave', name: 'New York Paid Family Leave (PFL) Notice', description: 'Notice of NY PFL: up to 12 weeks at 67% of employee AWW (capped at 67% state AWW) for bonding, caregiving, or qualifying military exigency. Employee premium: 0.373% of wages (2024 cap: $333.25/year).', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Criminal penalty; employer pays employee portion if notice not provided timely', citation: 'NY Workers\' Compensation Law §200 et seq.; NY PFL regulations 12 NYCRR 380' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ny-earned-sick-leave', name: 'New York State Earned Sick Leave (ESL) Notice', description: 'Notice of NY ESL (2020): employers with 100+ employees: 56 hours paid leave; 5–99 employees: 40 hours paid; <5 employees + net income >$1M: 40 hours paid; <5 employees + <$1M: 40 hours unpaid.', category: 'state', required: true, deadline: 'First day (for employers with 5+ employees)', penalty: { amount: 'NYDOL enforcement; civil penalty $2,000+; employee private right of action', citation: 'NY Labor Law §196-b; NY ESL Act (2020)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ny-salary-transparency', name: 'NY Pay Transparency Law Notice (S9427A)', description: 'For employers with 4+ employees: all job postings must include compensation range. Employees in position must be notified of pay range upon request, promotion, or transfer offer.', category: 'state', required: true, deadline: 'At hire/offer', penalty: { amount: '$1,000–$3,000 first violation; up to $25,000 repeated violations', citation: 'NY Labor Law §194-b; NY S9427A (effective 2023)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ny-hero-act', name: 'NY HERO Act Safety Plan Acknowledgment', description: 'Acknowledgment of employer\'s airborne infectious disease exposure prevention plan (NY HERO Act). Employee must receive copy of plan and confirm receipt.', category: 'state', required: true, deadline: 'First day (within 30 days of plan adoption/hire)', penalty: { amount: '$1,000–$10,000 per violation; NYSDOL enforcement', citation: 'NY Labor Law §218-b; NY HERO Act (S1034B, 2021)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['New York minimum wage: $16.00/hour (NYC, Long Island, Westchester 2024); $15.00/hour (remainder)', 'NYC has additional requirements: Commuter Benefits Law, Earned Safe and Sick Time additions', 'NY state income tax: use IT-2104 Employee\'s Withholding Allowance Certificate', 'New York requires new hire reporting within 20 days to NY DOL/DTF']
  },
  NC: {
    state: 'NC', stateName: 'North Carolina',
    requirements: [
      { id: 'nc-wage-notice', name: 'North Carolina Wage & Hour Notice', description: 'Written notice at hire of promised wages, promised wage benefits (vacation, sick pay), and payday. Must be provided before first paycheck.', category: 'state', required: true, deadline: 'Before first paycheck', penalty: { amount: '$250–$500 per violation; civil penalty', citation: 'N.C.G.S. §95-25.13; NC Wage & Hour Act' }, completionType: 'form', gateOrder: 4 },
      { id: 'nc-e-verify', name: 'E-Verify Enrollment (G.S. §64-26)', description: 'North Carolina requires all employers with 25+ employees to use E-Verify. Employee acknowledges verification.', category: 'state', required: true, deadline: 'Before start of employment', penalty: { amount: '$10,000 first violation; $25,000 per subsequent violation; license suspension', citation: 'N.C.G.S. §64-26; NC E-Verify Statute (2006)' }, completionType: 'acknowledgment', gateOrder: 2 },
      { id: 'nc-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' comp coverage. Required for employers with 3+ employees.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class H felony; civil liability; $100/day penalty', citation: 'N.C.G.S. §97-93; NC Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['North Carolina minimum wage: $7.25/hour (federal rate)', 'North Carolina state income tax: use NC-4 Employee\'s Withholding Allowance Certificate', 'NC is a right-to-work state']
  },
  ND: {
    state: 'ND', stateName: 'North Dakota',
    requirements: [
      { id: 'nd-wage-notice', name: 'North Dakota Wage Payment Notice', description: 'Written notice of pay rate, pay period, and paydays.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000 per violation; civil penalty', citation: 'N.D.C.C. §34-14-02 et seq.; ND Wage Payment Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'nd-workers-comp', name: 'Workers\' Compensation Notice (ND WSI)', description: 'North Dakota has monopolistic state workers\' comp fund (WSI). All employers must provide notice of WSI coverage.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$250/day for failure to maintain WSI coverage; personal liability', citation: 'N.D.C.C. §65-01-02; ND Workers\' Compensation Bureau' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['North Dakota minimum wage: $7.25/hour (federal rate)', 'North Dakota state income tax: use ND Form NDW-R', 'North Dakota has monopolistic state workers\' comp fund (WSI)']
  },
  OH: {
    state: 'OH', stateName: 'Ohio',
    requirements: [
      { id: 'oh-wage-notice', name: 'Ohio Minimum Fair Wage Standards Act Notice', description: 'Written notice of pay rate, pay period, and payday. MFWSA poster must be displayed. Employee acknowledgment required.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $100–$1,000 per violation; ODOL enforcement', citation: 'Ohio Rev. Code Ann. §4111.10; Ohio MFWSA' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'oh-workers-comp', name: 'Workers\' Compensation Notice (BWC)', description: 'Ohio has monopolistic state workers\' comp fund (BWC). Notice of Ohio BWC coverage, claim procedure, and employee rights.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Up to $1,000/day for operating without BWC coverage; civil and criminal liability', citation: 'Ohio Rev. Code Ann. §4123.35; Ohio Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Ohio minimum wage: $10.45/hour (employers with gross receipts >$385,000)', 'Ohio state income tax: use IT 4 Employee\'s Withholding Exemption Certificate', 'Ohio has monopolistic state BWC fund']
  },
  OK: {
    state: 'OK', stateName: 'Oklahoma',
    requirements: [
      { id: 'ok-atwill', name: 'Oklahoma At-Will Employment Notice', description: 'Oklahoma is at-will. Written acknowledgment of at-will status.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; supports at-will doctrine', citation: 'Okla. Stat. tit. 15, §219; Oklahoma at-will employment' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ok-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of Oklahoma workers\' comp coverage (through CompSource or private insurer). Employers with 1+ employees required.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class A misdemeanor; stop-work order; civil liability', citation: 'Okla. Stat. tit. 85A, §5; Oklahoma Workers\' Compensation Code' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Oklahoma minimum wage: $7.25/hour (federal rate)', 'Oklahoma state income tax: use OK-W-4 form', 'No state-mandated paid leave requirements']
  },
  OR: {
    state: 'OR', stateName: 'Oregon',
    requirements: [
      { id: 'or-ofla-pfml', name: 'Oregon Paid Leave Oregon (PLO) & OFLA Notice', description: 'Notice of Oregon Paid Leave Oregon (PLO): up to 12 weeks paid leave (14 for pregnancy + complications), 60% wage replacement (up to $1,523.63/week 2024). Employee contributes 60% of 1% wages. Also covers Oregon Family Leave Act (OFLA).', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $1,000 per violation; BOLI enforcement', citation: 'ORS §657B.005 et seq.; Oregon Paid Leave Act (SB 1049); OFLA ORS §659A.150' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'or-earned-sick-leave', name: 'Oregon Earned Sick Time Notice (ORS §653.641)', description: 'Notice of Oregon protected sick time: employers with 10+ employees provide 1 hour per 30 hours worked (up to 40 hours) paid. Smaller employers: 1 hour per 30 (up to 40) unpaid protected.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000 per violation; BOLI enforcement; civil action', citation: 'ORS §653.641; Oregon Sick Time Law (2015)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'or-wage-notice', name: 'Oregon Wage Notice (ORS §652.120)', description: 'Notice of pay rate, pay period, payday, and place of payment. Written notice at hire.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000 per violation; BOLI enforcement', citation: 'ORS §652.120; Oregon Wage Payment Act' }, completionType: 'form', gateOrder: 4 },
      { id: 'or-equal-pay', name: 'Oregon Equal Pay Act Notice (SB 1532)', description: 'Notice of Oregon Equal Pay Act: prohibits pay discrimination on basis of protected class. Employer may not inquire about salary history. Employee has right to request pay equity analysis.', category: 'state', required: true, deadline: 'First day/offer', penalty: { amount: 'Compensatory damages; civil penalty $1,000 per violation; BOLI enforcement', citation: 'ORS §652.220; Oregon Equal Pay Act (2017, SB 1532)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Oregon minimum wage: $14.70/hour (standard); $15.45/hour (Portland metro); $13.70/hour (non-urban) 2024', 'Oregon state income tax: use OR-W-4 form', 'Oregon has comprehensive worker protection laws — one of the strongest regimes in the US']
  },
  PA: {
    state: 'PA', stateName: 'Pennsylvania',
    requirements: [
      { id: 'pa-wage-notice', name: 'Pennsylvania Wage Payment and Collection Law Notice', description: 'Written notice of regular payday and pay period. Notice must be provided on or before first day of work.', category: 'state', required: true, deadline: 'First day (or before)', penalty: { amount: 'Civil penalty $500 per violation; restitution; criminal misdemeanor', citation: '43 Pa. Stat. Ann. §260.1 et seq.; Pennsylvania WPCL' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'pa-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of Pennsylvania workers\' comp coverage. All employers with 1+ employees must carry. LIBC-500 form required.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Third degree felony; $2,500 minimum fine; civil liability', citation: '77 Pa. Stat. Ann. §501; Pennsylvania Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Pennsylvania minimum wage: $7.25/hour (federal rate)', 'Pennsylvania state income tax: use PA-W3 and employee setup form', 'Philadelphia has city-specific requirements including paid sick leave']
  },
  RI: {
    state: 'RI', stateName: 'Rhode Island',
    requirements: [
      { id: 'ri-tdi-pfml', name: 'Rhode Island TDI/PFL Notice (RI PFML)', description: 'Notice of Rhode Island Temporary Disability Insurance and Paid Family Leave: up to 5 weeks paid family leave at 60% wages; up to 30 weeks TDI. Employee contribution: 1.1% of wages.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalties; DLT enforcement; employer liability for withheld premiums', citation: 'R.I. Gen. Laws §28-41-1 et seq.; RI TDI Act; RI Parental and Family Medical Leave Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ri-wage-notice', name: 'Rhode Island Payment of Wages Notice', description: 'Written notice of pay rate, pay period, and payday.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$100–$500 per violation; civil penalty', citation: 'R.I. Gen. Laws §28-14-2.1; RI Payment of Wages Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Rhode Island minimum wage: $14.00/hour (2024)', 'Rhode Island state income tax: use RI W-4 form', 'Providence has local living wage requirements for certain employers']
  },
  SC: {
    state: 'SC', stateName: 'South Carolina',
    requirements: [
      { id: 'sc-payment-wages', name: 'South Carolina Payment of Wages Act Notice', description: 'Written notification to employees at time of hire of rate of pay, and time and place of payment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Three times unpaid wages plus attorney fees; civil penalty', citation: 'S.C. Code Ann. §41-10-20; SC Payment of Wages Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'sc-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' comp coverage for employers with 4+ employees.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class B misdemeanor; civil liability; $100/day penalty', citation: 'S.C. Code Ann. §42-5-20; SC Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['South Carolina minimum wage: $7.25/hour (federal rate)', 'South Carolina state income tax: use SC W-4 form', 'SC is a right-to-work state']
  },
  SD: {
    state: 'SD', stateName: 'South Dakota',
    requirements: [
      { id: 'sd-atwill', name: 'At-Will Employment Notice', description: 'South Dakota at-will employment acknowledgment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty', citation: 'SDCL §60-4-4; South Dakota at-will doctrine' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'sd-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of workers\' comp coverage through private insurer or SD State Fund.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class 1 misdemeanor; civil liability', citation: 'SDCL §62-5-1; South Dakota Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['South Dakota minimum wage: $11.20/hour (2024)', 'No state income tax in South Dakota', 'No state-mandated paid leave']
  },
  TN: {
    state: 'TN', stateName: 'Tennessee',
    requirements: [
      { id: 'tn-atwill', name: 'Tennessee At-Will Employment Notice', description: 'Written acknowledgment of Tennessee\'s strong at-will employment doctrine.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; supports enforcement of at-will doctrine', citation: 'T.C.A. §50-1-304; Tennessee Healthy Workplace Act; Tennessee at-will doctrine' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'tn-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of Tennessee workers\' comp coverage. Required for employers with 5+ employees (1+ in construction).', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class E felony; civil liability', citation: 'T.C.A. §50-6-405; Tennessee Workers\' Compensation Reform Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'tn-wage-notice', name: 'Tennessee Wage Regulations Notice', description: 'Written notice of pay rate, pay period, paydays, and place of payment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$100–$1,000 civil penalty', citation: 'T.C.A. §50-2-103; Tennessee Wage Regulations Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Tennessee minimum wage: $7.25/hour (federal rate)', 'No Tennessee state income tax on wages', 'Tennessee is a right-to-work state']
  },
  TX: {
    state: 'TX', stateName: 'Texas',
    requirements: [
      { id: 'tx-atwill', name: 'Texas At-Will Employment Notice', description: 'Written acknowledgment that Texas employment is at-will. No required reason or notice for termination by either party. Critical document for policy enforcement.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; required for enforcement of policies and non-compete agreements', citation: 'Texas at-will doctrine; Texas Labor Code §21.051; Montgomery County v. Park, 246 S.W.3d 610 (Tex. 2007)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'tx-workers-comp-election', name: 'Texas Workers\' Comp Election Notice (Form DWC-5)', description: 'UNIQUE: Texas is the ONLY state where workers\' comp is optional for private employers. Written notice to employee of employer\'s decision to be a subscriber (covered) or non-subscriber (DWC-5 required). Non-subscriber employers lose tort defenses.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Non-subscriber employers lose negligence defenses in tort suits; unlimited liability', citation: 'Texas Labor Code §406.002; TDI Form DWC-5; Texas Workers\' Compensation Act' }, completionType: 'form', gateOrder: 4 },
      { id: 'tx-payday-law', name: 'Texas Payday Law Notice (TX LC §61.013)', description: 'Written notice of pay schedule, including designated paydays. Employers must provide notice before first paycheck. Texas Payday Law requires employees be paid at least semi-monthly (biweekly or monthly for exempt employees).', category: 'state', required: true, deadline: 'Before first paycheck', penalty: { amount: '$1,000–$10,000 per violation; criminal misdemeanor; TWC administrative penalty', citation: 'Texas Labor Code §61.013; Texas Payday Law (Texas Lab. Code Ch. 61)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: [
      'Texas minimum wage: $7.25/hour (federal rate)',
      'No Texas state income tax — no state withholding form needed',
      'CRITICAL: Texas is the only state with optional workers\' comp — non-subscribers have no tort defenses',
      'New hire reporting within 20 days to Texas Office of the Attorney General (OAG)',
      'Non-compete agreements require consideration and must be ancillary to an enforceable agreement (Texas Bus. & Com. Code §15.50)'
    ]
  },
  UT: {
    state: 'UT', stateName: 'Utah',
    requirements: [
      { id: 'ut-atwill', name: 'Utah At-Will Employment Notice', description: 'Utah employment at-will acknowledgment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty; supports at-will doctrine', citation: 'Utah at-will doctrine; Touchard v. La-Z-Boy Inc., 148 P.3d 945 (Utah 2006)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'ut-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of Utah workers\' comp coverage through Workers\' Compensation Fund or private insurer.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class B misdemeanor; civil liability', citation: 'Utah Code Ann. §34A-2-201; Utah Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Utah minimum wage: $7.25/hour (federal rate)', 'Utah state income tax: use Utah TC-941 form or federal W-4', 'No state-mandated paid leave']
  },
  VT: {
    state: 'VT', stateName: 'Vermont',
    requirements: [
      { id: 'vt-pfml', name: 'Vermont PFML Notice', description: 'Notice of Vermont Paid Family and Medical Leave Insurance program: up to 12 weeks per year at 60% wages. State employee program launched 2023; broader voluntary framework available.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Penalties for non-compliance with state PFML programs where applicable', citation: 'Vt. Stat. Ann. tit. 21, §471 et seq.; Vermont PFML Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'vt-earned-sick-leave', name: 'Vermont Earned Sick Time Law Notice', description: 'Notice of Vermont Earned Sick Time (2017): 1 hour per 52 hours worked (up to 40 hours/year) for employers with 1+ employees. Can use for own or family illness.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $100–$5,000 per violation; VDOL enforcement', citation: '21 Vt. Stat. Ann. §481; Vermont Earned Sick Time Law (2017)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Vermont minimum wage: $13.67/hour (2024)', 'Vermont state income tax: use Vermont W-4VT form', 'Vermont has broad employment discrimination protections under FEPA']
  },
  VA: {
    state: 'VA', stateName: 'Virginia',
    requirements: [
      { id: 'va-wage-notice', name: 'Virginia Minimum Wage Act & Wage Notice', description: 'Written notice of pay rate, pay period, paydays, and employer name/address. Required under Virginia Minimum Wage Act.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$1,000 civil penalty per violation; DOLI enforcement', citation: 'Virginia Code §40.1-28.10; VMWA; Virginia Wage Payment Act §40.1-29' }, completionType: 'form', gateOrder: 4 },
      { id: 'va-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of Virginia workers\' comp coverage. Required for employers with 3+ employees.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class 3 misdemeanor; up to $10,000 civil penalty', citation: 'Va. Code Ann. §65.2-801; Virginia Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'va-pay-transparency', name: 'Virginia Pay Transparency Act Notice', description: 'Effective January 1, 2025: employers must provide pay range upon request and include in job postings. Non-retaliation provision for pay discussions.', category: 'state', required: true, deadline: 'At hire/offer', penalty: { amount: 'DOLI investigation; civil penalty; private right of action', citation: 'Virginia Code §40.1-28.7:8; Virginia Pay Transparency Act (2024)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Virginia minimum wage: $12.00/hour (2024)', 'Virginia state income tax: use VA-4 Employee\'s Withholding Exemption Certificate', 'Virginia Human Rights Act was significantly expanded in 2020']
  },
  WA: {
    state: 'WA', stateName: 'Washington',
    requirements: [
      { id: 'wa-equal-pay', name: 'Washington Equal Pay & Opportunities Act Notice (EPOA)', description: 'Notice of WA EPOA (SB 5761, effective Jan 2023): employers with 15+ employees must disclose pay scale in job postings and to employees upon request; disclose internal pay equity policies.', category: 'state', required: true, deadline: 'At hire/offer', penalty: { amount: '$500–$1,000 first violation; $1,000 per day ongoing violations', citation: 'RCW §49.58.010; Washington EPOA; SB 5761 (2022)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'wa-paid-family-medical-leave', name: 'Washington Paid Family & Medical Leave Notice', description: 'Notice of WA PFML: up to 12 weeks family + 12 weeks medical (18 weeks combined max 2024). Employee contributes 72.76% of 0.74% premium; employer (50+ employees) contributes 27.24%.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '1.5x interest on unpaid premiums; civil penalty $250/day; ESD enforcement', citation: 'RCW §50A.05.010 et seq.; Washington PFML Act (SB 5975, 2017)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'wa-paid-sick-leave', name: 'Washington Paid Sick Leave Notice (I-1433)', description: 'Notice of WA PSL: 1 hour per 40 hours worked; no cap on accrual; can carry over 40+ hours. Available after 90-day tenure. Required for all employees statewide.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil penalty $500 per violation; L&I enforcement; employee private right of action', citation: 'RCW §49.46.210; Initiative 1433 (2016); L&I WAC 296-128-600' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'wa-workers-comp', name: 'Washington Workers\' Compensation (L&I) Notice', description: 'Washington has monopolistic state workers\' comp fund (L&I). Notice of L&I coverage, claim procedures, and employee rights.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Personal liability for employer; criminal penalties; premium penalties', citation: 'RCW §51.08.180; Washington Industrial Insurance Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'wa-nondisclosure', name: 'Washington Silenced No More Act Notice (SB 5693)', description: 'Notice that non-disclosure agreements cannot prevent employees from discussing wages or workplace issues including discrimination. Employee informed of right to discuss pay with coworkers.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$10,000 per violation plus attorney fees; civil penalty', citation: 'RCW §49.44.210; Washington Silenced No More Act (SB 5693, 2022)' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Washington minimum wage: $16.28/hour (2024)', 'Seattle and other cities have higher local minimum wages: Seattle $19.97/hour (2024)', 'No Washington state income tax', 'Washington has monopolistic L&I workers\' comp fund — cannot use private insurer']
  },
  WV: {
    state: 'WV', stateName: 'West Virginia',
    requirements: [
      { id: 'wv-wage-payment', name: 'West Virginia Wage Payment & Collection Act Notice', description: 'Written notice of pay rate, pay period, paydays, and employer contact.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$200–$3,000 per violation; civil penalty + attorney fees', citation: 'W. Va. Code §21-5-9; WV Wage Payment & Collection Act' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'wv-workers-comp', name: 'BrickStreet Insurance / Workers\' Comp Notice', description: 'Notice of West Virginia workers\' comp coverage. WV privatized its system in 2005.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class 4 misdemeanor; civil liability', citation: 'W. Va. Code §23-2-1 et seq.; WV Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['West Virginia minimum wage: $8.75/hour', 'West Virginia state income tax: use WV/IT-104 form', 'WV is a right-to-work state (2016)']
  },
  WI: {
    state: 'WI', stateName: 'Wisconsin',
    requirements: [
      { id: 'wi-wage-notice', name: 'Wisconsin Wage Payment Notice (WFEA)', description: 'Written notice of pay rate, paydays, pay period, and pay method. Required under Wisconsin Fair Employment Act and Wage Payment Act.', category: 'state', required: true, deadline: 'First day', penalty: { amount: '$100–$1,000 per violation; DWD enforcement', citation: 'Wis. Stat. §109.09; Wisconsin Wage Payment Act; Wis. Stat. §103.455' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'wi-workers-comp', name: 'Workers\' Compensation Notice', description: 'Notice of Wisconsin workers\' comp coverage. Required for employers with 3+ employees.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Class I felony; civil liability', citation: 'Wis. Stat. §102.28; Wisconsin Workers\' Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Wisconsin minimum wage: $7.25/hour (federal rate)', 'Wisconsin state income tax: use WT-4 Employee\'s Wisconsin Withholding Exemption Certificate/New Hire Reporting', 'New hire reporting required within 20 days to Wisconsin DOR']
  },
  WY: {
    state: 'WY', stateName: 'Wyoming',
    requirements: [
      { id: 'wy-atwill', name: 'Wyoming At-Will Employment Notice', description: 'Wyoming at-will employment acknowledgment.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'No direct penalty', citation: 'Wyoming at-will doctrine; Wilder v. Cody Country Chamber of Commerce, 868 P.2d 512 (Wyo. 1994)' }, completionType: 'acknowledgment', gateOrder: 4 },
      { id: 'wy-workers-comp', name: 'Wyoming Workers\' Safety & Compensation Division Notice', description: 'Wyoming has quasi-monopolistic state workers\' comp fund (W/SACD). Notice of coverage and employee rights.', category: 'state', required: true, deadline: 'First day', penalty: { amount: 'Civil liability; criminal penalties', citation: 'Wyo. Stat. Ann. §27-14-102; Wyoming Worker\'s Compensation Act' }, completionType: 'acknowledgment', gateOrder: 4 }
    ],
    notes: ['Wyoming minimum wage: $5.15/hour (state) — federal $7.25/hour applies to most', 'No Wyoming state income tax', 'Wyoming has quasi-monopolistic state workers\' comp system']
  }
}

export function getComplianceRequirements(state: string): StateCompliance | null {
  return STATE_DATA[state] || null
}

export function getAllFederalRequirements(): ComplianceRequirement[] {
  return FEDERAL_REQUIREMENTS
}

export function getFullCompliancePackage(state: string): {
  federal: ComplianceRequirement[]
  state: StateCompliance | null
  allRequirements: ComplianceRequirement[]
  totalPenaltyExposure: string
} {
  const stateData = getComplianceRequirements(state)
  const allRequirements = [
    ...FEDERAL_REQUIREMENTS,
    ...(stateData?.requirements || [])
  ]

  return {
    federal: FEDERAL_REQUIREMENTS,
    state: stateData,
    allRequirements,
    totalPenaltyExposure: calculatePenaltyExposure(allRequirements)
  }
}

export function calculatePenaltyExposure(requirements: ComplianceRequirement[]): string {
  // Returns estimated max penalty exposure for all missing items
  // Based on median penalty amounts from the requirement data
  const penaltyEstimates: Record<string, number> = {
    'fed-i9': 2701,
    'fed-w4': 500,
    'fed-anti-harassment': 50000,
    'fed-osha': 16131,
  }

  let total = 0
  requirements.forEach(req => {
    // Extract first dollar amount from penalty string
    const match = req.penalty.amount.match(/\$([0-9,]+)/)
    if (match) {
      const amount = parseInt(match[1].replace(/,/g, ''))
      total += amount
    }
  })

  return total.toLocaleString()
}

export function getAllStates(): Array<{ code: string; name: string; requirementCount: number }> {
  return Object.values(STATE_DATA).map(state => ({
    code: state.state,
    name: state.stateName,
    requirementCount: state.requirements.length + FEDERAL_REQUIREMENTS.length
  })).sort((a, b) => a.name.localeCompare(b.name))
}

export const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'DC', name: 'Washington D.C.' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' }, { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' }, { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' }, { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' }, { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' }, { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' }, { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' }, { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
]
