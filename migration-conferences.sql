-- Run this once in the D1 Console (you already ran schema.sql earlier for
-- the manuscripts table — this just adds the new conferences table on top).

CREATE TABLE IF NOT EXISTS conferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edition TEXT NOT NULL,
  title TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  venue TEXT,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_conferences_sort ON conferences (sort_order DESC);

INSERT INTO conferences (edition, title, start_date, end_date, venue, description, image_url, sort_order) VALUES
('ICMSO 2023 · 10th Annual', 'Digitized Economy: Challenges and the Imperatives of Mathematical Tools', '28 August 2023', '2 September 2023', 'University of Lagos (physical & virtual)', 'Keynote: "Facial Recognition Systems with Applications to Digitized Financial Transactions" — Prof. G. Degla. Tracks: Pure Mathematics, Applied Mathematics, Statistics & Applications. Hands-on training: Python & LaTeX. Registration: ₦20,000 (early) / ₦25,000 (at venue) local · $100 international physical / $50 international virtual · 50% student discount.', 'assets/img/icmso2023-flyer.jpg', 100),
('ICMSO 2022 · 9th Annual', 'Financial and Digital Inclusion in Emerging Economies: Mathematical Tools and Enabling Technologies', '2 May 2022', '6 May 2022', 'IMSP, Université d''Abomey-Calavi, Porto-Novo, Benin Republic', 'Tracks: Computational Fluid Dynamics · Computational Optimization · Financial Mathematics & Applied Statistics · Mathematical Analysis & Optimization. Hands-on training in R and LaTeX. Co-hosted with IMSP Benin — AMSO''s first conference outside Nigeria.', NULL, 90),
('Workshop/Conference · 2022', 'International Conference on Fractional Calculus and its Applications', '21 November 2022', '27 November 2022', 'CITS, University of Lagos', 'Presented by AMSO in collaboration with the Mathematical Analysis and Applications Research Group (MAARG), Department of Mathematics, University of Lagos. Special guest of honour: Prof. A. A. Arigbabu, Commissioner for Education, Ogun State.', NULL, 85),
('ICMSO 2020 · 7th Annual', 'Harnessing Mathematical Models in Artificial Intelligence, Optimization and Data Analytics as Tools for Sustainable National Development and Security', 'Workshop 22 March 2020', 'Conference 25 March 2020', 'National Mathematical Centre, Abuja', 'Keynote: Dr. Ogbonnaya Onu, Honourable Minister of Science & Technology, Federal Republic of Nigeria. Workshop groups: Operator Equations & Optimization, Machine Learning Techniques & Optimization (CNN, RNN, Swarm Optimization, Big Data), Techniques for Modelling Real-Life Problems. Hands-on training in Python, R and MATLAB/Maple.', NULL, 70),
('ICAPTA 2019 · 6th Annual', 'Mathematical Methods and Optimization in Risk and Financial Modeling', '10 March 2019', '16 March 2019', 'National Mathematical Centre, Abuja', 'Keynote: Mr. Festus Olabiyi, FCIIN, Executive Director, Capital Express Assurance Ltd. Workshop groups: Convexity & Optimization Methods; Network Optimization & Machine Learning. Invited speakers included Prof. C. E. Chidume, Prof. Chris Thron, Prof. Guy Degla and Prof. Jules Degila.', NULL, 60),
('ICAPTA 2018 · 5th Annual', 'Optimization Methods for Entrepreneurial Development and National Growth', '11 March 2018', '17 March 2018', 'Faculty of Science, University of Lagos', 'Keynote address: Prof. Stephen E. Onah, Director/Chief Executive, National Mathematical Centre, Abuja. Workshop topics included evolutionary algorithms, inertial algorithms for optimization, optimization in Hilbert spaces, and variational inequalities.', NULL, 50),
('ICAPTA 2017 · 4th Annual', 'Optimizing Industrial Processes for Cost Effective Operations in Medium and Large Scale Industries', '5 March 2017', '11 March 2017', 'Faculty of Science, University of Lagos', 'Invited speakers: Prof. Montaz Ali (Wits, South Africa), Prof. Mujahid Abass (Pretoria, South Africa), Prof. Christopher Thron (Texas A&M, USA), Prof. M. Osilike (UNN, Nigeria), Prof. Aderemi Adewunmi (KwaZulu-Natal, South Africa). Workshop topics included Object Python for optimization, evolutionary algorithms, and fixed point theory.', NULL, 40),
('ICAPTA 2016 · 3rd Annual', 'Mathematical Analysis and Optimization: Tools for the Sustainability of Small and Medium-Scale Enterprises (SMEs)', '6 March 2016', '12 March 2016', 'Faculty of Science, University of Lagos', 'Keynote: Prof. Panos M. Pardalos, University of Florida. Also featuring Prof. Charles E. Chidume and Prof. Christopher Thron. Workshop topics: Octave & Python for scientific computing, genetic algorithms, fixed-point theory, statistics for analytics and decision-making.', NULL, 30);
