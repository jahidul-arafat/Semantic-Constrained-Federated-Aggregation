/* ============================================
   SCFA Interactive Research Story - Enhanced JavaScript
   With Synchronized Statistics Highlighting,
   Animated Equations, Voice Selection
   ============================================ */

// State
let currentScene = 0;
let narratingScene = -1;
let isPaused = false;
let narrationEnabled = true;
let speechRate = 1;
let speechSynth = window.speechSynthesis;
let currentUtterance = null;
let selectedVoice = null;
let availableVoices = [];
let isNarrating = false;
let highlightTimers = [];

// DOM Elements
const scenes = document.querySelectorAll('.scene');
const totalScenes = scenes.length;
const progressBar = document.getElementById('progressBar');
const sceneNav = document.getElementById('sceneNav');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pauseBtn = document.getElementById('pauseBtn');
const audioBtn = document.getElementById('toggleNarration');

// ============================================
// COMPREHENSIVE SPEECH SCRIPTS WITH STAT MARKERS
// Format: { text: "...", highlights: [{stat: "id", delay: ms}] }
// ============================================
const speechScripts = {
    0: {
        text: `Welcome to the SCFA Interactive Research Story, presented by Jahidul Arafat, Presidential and Woltosz Graduate Research Fellow at Auburn University, and former Senior Solution Architect at Oracle and Principal System Analyst at bKash.
        
        This presentation will guide you through groundbreaking research on Semantic-Constrained Federated Aggregation. We achieved 22% faster convergence, 2.7 times better privacy-utility tradeoff, and discovered a critical 18% violation threshold.
        
        Enable narration for the full storytelling experience, then click Begin Presentation. Use arrow keys to navigate, and press R to resync audio with the current slide.`,
        highlights: []
    },

    1: {
        text: `Before we dive into the technical details, let me explain what "Semantic-Constrained Federated Aggregation" actually means. This is the core novelty of our research.
        
        In standard federated learning, the server blindly averages model parameters from all clients. But here's the problem: different clients may learn features that have completely different meanings. When you average incompatible representations, you get semantic collision - both meaningful signals are lost.
        
        Let me break this down into three parts.
        
        First, "Semantic" refers to the meaning encoded in feature representations. In machine learning, this means how model layers represent concepts, and critically, the alignment between different clients' feature spaces.
        
        Second, "Constrained" means the aggregation step is restricted by rules. Models are only averaged if they encode compatible meanings. Semantically misaligned layers get reweighted or transformed. Updates that would cause semantic corruption are filtered or projected.
        
        Third, why do we need this? Without constraints, naïve averaging causes semantic drift where meanings diverge over training rounds, feature collision where conflicting representations mix together, and degraded accuracy from overwriting meaningful local features.
        
        Here's a concrete example: Imagine Factory A encodes "tool wear" in dimension 4, while Factory B encodes the same concept in dimension 11. If we simply average the weights, both meaningful signals are lost in the noise.
        
        SCFA solves this by first detecting similar concepts across clients, then aligning embeddings to shared semantic axes, and only then combining the updates safely.
        
        The key insight is this: SCFA ensures the global model is updated only with client parameters whose feature representations are semantically aligned, preserving the meaning of learned concepts across heterogeneous data sources.`,
        highlights: []
    },

    2: {
        text: `Before we dive into the research, let's familiarize ourselves with the key terminology you'll encounter throughout this presentation.
        
        In Federated Learning, data stays local at each facility, and only model updates are shared. FedAvg is the standard algorithm that averages these updates. Non-IID means the data distributions don't match across facilities, which causes convergence problems.
        
        Our SCFA framework introduces semantic constraints - domain rules from knowledge graphs. Each facility gets a validity score between 0 and 1 based on how well their updates follow these constraints. The violation rate, represented by rho, measures what percentage of constraints are broken.
        
        In mathematical notation, theta represents the hypothesis space reduction factor, epsilon is the privacy budget, alpha is the aggregation weight, and R-squared measures how well our theory matches practice.
        
        We use manufacturing ontologies like ISA-95 and MASON, with SPARQL queries to check constraints against knowledge graphs.`,
        highlights: []
    },

    3: {
        text: `This holistic architecture shows the complete SCFA framework from end to end.
        
        At the input layer, we have the Bosch Production Line dataset with 1.18 million samples and 968 features, combined with our knowledge graph containing 5,247 concepts and 3,000 constraint rules.
        
        The data is distributed across 5 manufacturing facilities for processing. Facility 1 has 470 thousand samples, Facility 2 has 120 thousand, Facility 3 has 330 thousand, Facility 4 has 95 thousand, and Facility 5 has 165 thousand. Each facility trains locally and sends gradient updates.
        
        The SCFA core algorithm has three steps: constraint validation computes validity scores, weight computation applies the formula alpha equals n times s divided by the sum, and aggregation combines the weighted updates.
        
        The outputs answer our three research questions: RQ1 achieves 22% faster convergence in 32 versus 41 rounds, RQ2 achieves 2.7 times better privacy with theta equals 0.37, and RQ3 identifies the critical threshold at rho equals 18% with R-squared of 0.93.`,
        highlights: [
            {stat: "samples", delay: 3000},
            {stat: "features", delay: 4000},
            {stat: "concepts", delay: 5500},
            {stat: "constraints", delay: 6500}
        ]
    },

    4: {
        text: `Here, I want to start by telling you a story about a problem that keeps manufacturing executives up at night.
        
        Imagine you're running five production facilities spread across the country. Each plant has thousands of sensors - measuring temperatures, vibrations, pressures, and electrical signals. In total, you're collecting data from 968 different sensors generating 1.18 million measurements.
        
        Facility 1 has 470 thousand samples, Facility 2 has 120 thousand, Facility 3 has 330 thousand, Facility 4 has 95 thousand, and Facility 5 has 165 thousand samples.
        
        Now, here's your nightmare: equipment failures. A single unexpected breakdown can cost you millions in downtime, lost production, and emergency repairs.
        
        The solution seems obvious, right? Use machine learning to predict failures before they happen. Train a model on all your sensor data.`,
        highlights: [
            {stat: "facilities", delay: 2500},
            {stat: "sensors", delay: 5000},
            {stat: "measurements", delay: 7000},
            {stat: "f1-samples", delay: 9000},
            {stat: "total-samples", delay: 15000}
        ]
    },

    5: {
        text: `But here's where it gets complicated. Your five plants cannot share their raw data. Maybe it's proprietary. Maybe there are privacy regulations. Maybe the data is just too massive to transfer.
        
        This is where Federated Learning comes in - the idea that each plant trains its own model locally, and only the model updates get shared and combined at a central server.
        
        But federated learning has major problems. First, privacy regulations prevent data sharing. Second, each plant has different equipment creating non-IID data - the distributions don't match, causing model conflicts.
        
        Third, convergence is slow - standard FL requires 50 or more communication rounds when data is heterogeneous. Fourth, existing solutions use algorithmic tricks without understanding the actual physics and engineering rules of manufacturing.
        
        In the standard federated learning flow, we have local training, then send updates, then aggregate - and this is where the problem happens, models fight each other - then distribute back. But nobody has fully solved this problem... until now.`,
        highlights: [
            {stat: "slow-rounds", delay: 18000}
        ]
    },

    6: {
        text: `What if we could teach our federated learning system to understand manufacturing?
        
        What if it knew that tool wear only increases over time - never decreases? That certain failures must happen in a specific causal order? That temperature predictions can't exceed physical limits? That energy and mass must be conserved?
        
        That's exactly what we did. We integrated decades of manufacturing expertise encoded in industry standards.
        
        We used ISA-95 with 2,341 concepts for manufacturing operations taxonomy. MASON provides 1,287 concepts for equipment dependencies and failure causality. NIST contributes 891 concepts for additive manufacturing. And Schema.org adds 728 concepts for product definitions.
        
        Together, they provide 5,247 total concepts, 12,893 relationships, and 3,000 constraint rules that our system uses to validate model updates.`,
        highlights: [
            {stat: "isa95", delay: 14000},
            {stat: "mason", delay: 17000},
            {stat: "nist", delay: 20000},
            {stat: "schema", delay: 23000},
            {stat: "total-concepts", delay: 26000},
            {stat: "relationships", delay: 28000},
            {stat: "constraint-rules", delay: 30000}
        ]
    },

    7: {
        text: `Now let me show you what a Knowledge Graph actually looks like - and you can interact with it yourself!
        
        On your screen, you see an interactive visualization of a manufacturing knowledge graph built with vis.js. This is a simplified version showing 24 nodes and 32 edges that represent our SCFA research domain.
        
        The graph has different node types shown in different colors. Blue nodes represent equipment like CNC machines and assembly lines. Teal nodes are sensors that monitor temperature, vibration, pressure, and current. Orange nodes represent process states like tool wear, spindle speed, and cutting force. Pink nodes are failure modes. Green nodes are predictions and outputs. And purple nodes are the semantic constraints themselves.
        
        The edges show relationships. Gray structural edges show containment and composition. Blue temporal edges show monitoring relationships. Orange causal edges with arrows show cause-and-effect chains - critically, tool wear leads to tool breakage. Purple dashed edges show how constraints validate specific nodes.
        
        You can drag nodes to explore the structure. Click the constraint cards below to highlight specific paths. Switch to "Custom Graph Builder" to create your own knowledge graph from scratch.
        
        The full SCFA system uses 5,247 concepts, 12,893 relationships, and derives 3,000 constraint rules from this structure. This is how domain knowledge becomes computable validation for federated learning!`,
        highlights: [
            {stat: "kg-nodes", delay: 42000},
            {stat: "kg-edges", delay: 44000},
            {stat: "kg-constraints", delay: 46000}
        ]
    },

    8: {
        text: `A critical question reviewers often ask is: How exactly is the Knowledge Graph constructed? Let me walk you through our systematic pipeline.
        
        Phase 1 is Source Ontology Acquisition. We leverage four established industry standards: ISA-95 provides 2,341 classes for manufacturing operations taxonomy. MASON contributes 1,287 classes for equipment dependencies. NIST Additive Manufacturing ontology adds 891 classes. And Schema.org provides 728 classes for product definitions. All are encoded in OWL/RDF format.
        
        Phase 2 is Semantic Entity and Relationship Extraction. Using rdflib and owlready2 libraries, we programmatically extract entities by iterating through ontology classes and mapping their metadata. We extract relationships by mapping object properties to graph edges. Critically, we perform semantic alignment to unify equivalent concepts across ontologies - for example, "ToolWear" in ISA-95 maps to "WearDegradation" in MASON. This yields 847 cross-ontology alignments.
        
        Phase 3 is Constraint Rule Derivation. This is where semantics become constraints. We use SPARQL queries to extract implicit rules from explicit ontological relationships. Temporal constraints emerge from monotonic property annotations - 892 rules. Causal constraints come from cause-precedes relationships - 756 rules. Capacity constraints derive from operating range specifications - 634 rules. And physical constraints come from conservation law annotations - 718 rules.
        
        The key academic contribution: Constraints are derived from semantic relationships, not manually specified. This makes our approach reproducible and transferable to other domains with existing ontologies.`,
        highlights: []
    },

    9: {
        text: `Another critical reviewer concern is the constraint validation mechanism. How exactly does it work, and do we problematically categorize constraints as high or low impact?
        
        Let me walk through our validation process step by step.
        
        Step 1: Prediction Generation. For each facility's update Delta-w-k, we temporarily apply it to the current global model and generate predictions on validation samples. The formula is y-hat-k equals f of X given the updated weights.
        
        Step 2: Per-Constraint Satisfaction Check. We evaluate each prediction against all 3,000 constraints individually. For temporal constraints, we check if y at time t+1 is greater than or equal to y at time t. For causal constraints, we verify the temporal ordering of predicted events. For capacity constraints, we check if predictions fall within physical bounds. For physical constraints, we verify conservation law satisfaction. Each constraint returns a binary indicator: 1 if satisfied, 0 if violated.
        
        Step 3: Continuous Validity Score Computation. Here's the crucial point about categorization. We do NOT categorize constraints into high or low impact. Instead, we compute a continuous validity score: s-k equals one over the number of constraints, times the sum of all satisfaction indicators. Every constraint contributes equally with weight 1/|C|.
        
        Why do we avoid categorical impact levels? First, what's "high impact" in one facility may be "low" in another - it's domain-dependent. Second, context matters - temperature criticality depends on the operation type. Third, manual categorization embeds human bias. Fourth, categories don't generalize across domains.
        
        Our approach uses uniform weighting with soft influence. The validity score smoothly modulates aggregation weight. Constraints that actually matter for the task will naturally affect predictions more. This is transparent, reproducible, and bias-free.`,
        highlights: []
    },

    10: {
        text: `The third critical reviewer question is: What is the impact of constraints on convergence? Let me present both our theoretical framework and empirical validation.
        
        Theorem 1 establishes our convergence rate. Under SCFA with semantic constraints C, the expected squared distance to optimum satisfies a bound that includes the term (1 minus rho), where rho is the constraint violation rate. This term directly multiplies the variance bound.
        
        The key insight: The (1-rho) factor shows that constraints directly reduce the variance bound. When rho equals zero - meaning perfect constraint satisfaction - we get maximum variance reduction. When rho is small, we still get significant benefit.
        
        How does this accelerate convergence? Through three mechanisms.
        
        First, Hypothesis Space Reduction. Constraints eliminate physically impossible parameter configurations. The constrained space is a strict subset of the full parameter space - our experiments show roughly 63% reduction.
        
        Second, Reduced Gradient Variance. When updates must satisfy physical laws, they tend to point in similar directions. FedAvg has high variance with scattered gradient directions. SCFA has low variance with aligned gradients.
        
        Third, this lower variance enables larger stable learning rates, leading to faster descent and fewer communication rounds.
        
        Our empirical validation on the Bosch dataset confirms this. FedAvg requires 41 rounds to converge. FedProx improves to 38 rounds - 7% faster. SCAFFOLD achieves 35 rounds - 15% faster. SCFA converges in just 32 rounds - 22% faster than FedAvg.
        
        Critically, we discovered a threshold at rho equals 18%. Below this, constraints accelerate convergence. Above this, excessive projection causes oscillation. We validated this threshold across three datasets with R-squared of 0.93.`,
        highlights: []
    },

    11: {
        text: `A critical question from peer reviewers is: What exactly is data heterogeneity, and how does it relate to our research?
        
        Let me provide a formal definition. Data heterogeneity, also called non-IID data, is the statistical property where local data distributions at each client differ from the global distribution and from each other. Mathematically, P_k of X and Y is not equal to P_j of X and Y for different clients k and j.
        
        There are four main types of heterogeneity that manifest in manufacturing.
        
        Type 1 is Feature Distribution Skew. The marginal distribution of inputs differs, but the conditional relationship is the same. In manufacturing, a German plant operates at 230 volts while a US plant uses 120 volts - different input features, same underlying physics.
        
        Type 2 is Label Distribution Skew. Different clients have different proportions of outcomes. A new plant might have 95% healthy operations and only 5% failures, while an aging plant has 40% failure cases. This creates severe class imbalance across the federation.
        
        Type 3 is Concept Drift - and this is particularly challenging. The same input can mean different things in different contexts. A vibration reading of 2.5 millimeters per second might be CRITICAL in a precision manufacturing plant with tight tolerances, but completely NORMAL in heavy industry with loose tolerances.
        
        Type 4 is Quantity Skew. Different plants contribute vastly different amounts of data. A large plant might contribute 450,000 samples while a small plant only has 35,000. Standard FedAvg would let large plants dominate while ignoring small plants.
        
        We quantify heterogeneity using the Dirichlet parameter alpha. Alpha approaching infinity means IID data. Alpha equals 0.1 represents extreme heterogeneity. Our experiments span the full spectrum from alpha equals 0.1 to alpha equals 10.`,
        highlights: []
    },

    12: {
        text: `Now let's examine the critical interaction between data heterogeneity and semantic constraints.
        
        Here's the core problem: When data is heterogeneous, locally optimal models may violate global constraints!
        
        Consider three clients with different local distributions. Client 1 only has data from new machines, so its local model learns that wear values sometimes decrease - because in its limited view, that pattern appears valid. Client 2 has full lifecycle data and correctly learns that wear only increases. When we try to aggregate these models, Client 1's update VIOLATES the temporal constraint that wear can only increase, while Client 2's update SATISFIES it.
        
        Let me show you the quantified impact. We plotted constraint violation rate against heterogeneity level. With FedAvg, as heterogeneity increases from alpha equals 10 to alpha equals 0.1, violation rates skyrocket from 4% to 38% - well above our critical 18% threshold.
        
        But with SCFA, violation rates stay bounded. Even at extreme heterogeneity with alpha equals 0.1, our violation rate is only 14.7% - still below the threshold! That's a 62% reduction in constraint violations.
        
        How does SCFA achieve this? Through three mechanisms.
        
        First, the Semantic Alignment Layer maps heterogeneous feature representations to a unified semantic space before checking constraints. Features that mean the same thing get aligned.
        
        Second, Validity-Weighted Aggregation gives clients with heterogeneity-induced violations lower weights. They contribute less to the global model.
        
        Third, Domain-Invariant Constraints from physics hold regardless of local data distribution. Wear increases everywhere - in Germany, USA, China, Japan. These universal laws provide stable validation criteria.
        
        Our Proposition 2 formalizes this: SCFA's violation rate is bounded by FedAvg's violation rate times a logarithmic reduction factor. With theta equals 0.37, we achieve 63% violation reduction at extreme heterogeneity - validated with R-squared of 0.91 across three datasets.`,
        highlights: []
    },

    13: {
        text: `Now let me introduce our solution: Semantic-Constrained Federated Aggregation, or SCFA.
        
        The algorithm works in four steps.
        
        Step 1: Local Training. Each facility trains on its local sensor data for E epochs, computing gradient updates. This is the same as regular federated learning - each plant learns from its own data.
        
        Step 2: Constraint Validation. This is our key innovation! The server applies each update temporarily and checks it against four constraint categories: Temporal constraints like tool wear only increases, Causal constraints for failure ordering, Capacity constraints for equipment limits, and Physical constraints for conservation laws. The output is a validity score s_k between 0 and 1 for each facility.
        
        Step 3: Weighted Aggregation. We compute the aggregation weight based on both data size AND constraint validity. Alpha_k equals n_k times s_k, divided by the sum of all n_j times s_j. The key insight: constraint violators get down-weighted!
        
        Step 4: Global Update. We compute the new global model using the weighted aggregation. The result is that the model converges faster on the valid subspace.`,
        highlights: []
    },

    14: {
        text: `We designed three research questions to rigorously validate our approach. Each question has a theoretical contribution - a theorem or proposition - that we then empirically validated on real manufacturing data.
        
        Research Question 1 asks: Can semantic constraints accelerate convergence under non-IID data? The answer is yes - 22% faster convergence!
        
        Research Question 2 asks: What are the privacy-utility tradeoffs of constraint-based aggregation? The answer is a 2.7 times improvement in the privacy-utility tradeoff!
        
        Research Question 3 asks: How does constraint violation rate correlate with model performance? The answer is a linear relationship with a critical threshold at 18%.
        
        Let's dive deep into each one. You can click on any card to jump directly to that section.`,
        highlights: [
            {stat: "rq1-answer", delay: 8000},
            {stat: "rq2-answer", delay: 14000},
            {stat: "rq3-answer", delay: 20000}
        ]
    },

    15: {
        text: `Research Question 1: Can semantic constraints accelerate convergence under non-IID data?
        
        The answer is a resounding yes! We achieved 22% faster convergence, with our theory matching experiments at R-squared equals 0.94.
        
        Look at the architecture diagram. On the left, you see our 5 manufacturing facilities sending model updates to the central server. The server then validates each update against our four constraint categories: temporal, causal, capacity, and physical.
        
        The key innovation is the weighted aggregation - updates that pass constraint validation get higher weights, guiding the model toward physically valid solutions. This reduces the rounds needed from 41 to just 32 under moderate heterogeneity.`,
        highlights: [
            {stat: "rq1-result", delay: 3000},
            {stat: "rq1-rsq", delay: 6000}
        ]
    },

    16: {
        text: `Now let me show you the mathematics behind why this works. Our Theorem 1 establishes the convergence rate for SCFA.
        
        The equation shows that Convergence Rate equals 1 over square root of T, the standard federated learning term that gets better with more rounds, plus rho times L_c times D, our new violation penalty term.
        
        Let me break down each parameter. T is the number of communication rounds - more rounds means better convergence. Rho is the violation rate - you want to keep this below 5%. L_c is the constraint smoothness, which we measured at 1.42. And D is the data heterogeneity, measured at 1.87.
        
        Here's the key insight: Keep violations low - aim for rho approaching zero - and you get FedAvg-level convergence on a much smaller, cleaner hypothesis space where all physically-impossible solutions have been eliminated!`,
        highlights: [
            {stat: "rho-target", delay: 20000},
            {stat: "lc-value", delay: 23000},
            {stat: "d-value", delay: 26000}
        ]
    },

    17: {
        text: `Let me show you our experimental results for convergence.
        
        Under mild heterogeneity with Dirichlet alpha equals 10, SCFA converges in 27 rounds versus 34 for FedAvg - a 20.6% speedup.
        
        Under moderate heterogeneity with alpha equals 1, SCFA converges in 32 rounds versus 41 for FedAvg - a 22% speedup.
        
        And here's the beautiful part: the more heterogeneous your data, the more constraints help! Under severe non-IID conditions with alpha equals 0.1, we see a 26.9% speedup, going from 52 rounds down to just 38.
        
        That's because constraints are eliminating the most problematic regions of the solution space where the plants' models would otherwise fight each other.
        
        Our theory-to-practice fit achieved R-squared of 0.94. We also measured gamma equals 0.41, representing a 41% reduction in heterogeneity.
        
        For executives, this means faster time-to-deployment and 22% less communication bandwidth.`,
        highlights: [
            {stat: "alpha-mild", delay: 3000},
            {stat: "scfa-mild", delay: 4500},
            {stat: "speedup-mild", delay: 6000},
            {stat: "alpha-mod", delay: 8000},
            {stat: "scfa-mod", delay: 9500},
            {stat: "speedup-mod", delay: 11000},
            {stat: "alpha-sev", delay: 15000},
            {stat: "scfa-sev", delay: 16500},
            {stat: "speedup-sev", delay: 18000},
            {stat: "severe-speedup", delay: 20000},
            {stat: "rq1-rsq-final", delay: 25000},
            {stat: "gamma", delay: 27000}
        ]
    },

    18: {
        text: `Research Question 2: What are the privacy-utility tradeoffs of constraint-based aggregation?
        
        The answer is extraordinary: a 2.7 times better privacy-utility tradeoff. Under GDPR-compatible privacy settings, we lose only 3.7% utility compared to 12.1% for standard methods.
        
        Look at the architecture diagram. On the left, you see the full hypothesis space - 8.7 million parameters worth of possibilities. That's a lot of space for privacy noise to corrupt.
        
        On the right, after applying constraints, we're down to just 3.2 million effective parameters. The same amount of noise has much less relative impact in this smaller space! This is the key to our privacy improvement.`,
        highlights: [
            {stat: "rq2-result", delay: 3000},
            {stat: "scfa-loss", delay: 7000},
            {stat: "fedavg-loss", delay: 9000}
        ]
    },

    19: {
        text: `Now let's talk about the mathematics of privacy.
        
        First, look at the hypothesis space visualization. The full space has 8.7 million parameters - all possible solutions. After constraints reduce it by 63%, we're down to just 3.2 million effective parameters - only valid solutions remain.
        
        Our Theorem 2 shows that utility loss is proportional to sigma squared times d, the noise times dimensions, divided by H, the hypothesis space size.
        
        We measured theta equals 0.37, meaning a 63% hypothesis space reduction. Same noise plus smaller space equals higher signal-to-noise ratio!
        
        Think of it like this: if you're trying to find a signal in a massive warehouse full of noise, it's hard. But if you know the signal is definitely in one corner of that warehouse, the same amount of noise is much less problematic. Constraints tell us which corner contains all physically valid solutions!`,
        highlights: [
            {stat: "full-params", delay: 4000},
            {stat: "reduction-pct", delay: 7000},
            {stat: "constrained-params", delay: 9000},
            {stat: "theta-value", delay: 20000},
            {stat: "reduction-result", delay: 22000}
        ]
    },

    20: {
        text: `Let's take a deep dive into Hypothesis Space Reduction - the key mechanism behind our privacy-utility improvement.
        
        Section 1: How is the hypothesis space reduced? The full hypothesis space contains 8.7 million possible parameter configurations. We systematically eliminate invalid regions through four types of constraints.
        
        First, temporal constraints remove solutions where tool wear could decrease - that's physically impossible and eliminates 28% of the space. Second, causal constraints remove acausal relationships, cutting another 18%. Third, capacity constraints enforce physical bounds like maximum temperatures, removing 12% more. Finally, physical laws like energy conservation eliminate another 5%.
        
        The mathematical definition is elegant: H-constrained equals the set of all w in H-full where every constraint c evaluates to true. The result? A 63% total reduction.
        
        Section 2: What factors impact this reduction? Four key conditions matter. First, constraint specificity - vague constraints like "temperature affects output" barely help, while specific bounds like "T between 20 and 200 Celsius" eliminate 15% of invalid space. Second, the constraint count - we derive 3,000 constraints from 4 ontologies. Third, constraint independence - independent constraints multiply their reductions. Fourth, domain coverage - our constraints cover 94% of the prediction domain.
        
        Critical condition: the violation rate rho must stay below 18%. Above this threshold, constraint projections become too aggressive and cause oscillation.
        
        Section 3: Why is this necessary? Without reduction, differential privacy must add noise to mask ALL possible gradients in the full space. More space means more noise needed, which destroys utility. The signal-to-noise ratio is inversely proportional to space size.
        
        With reduction, we only need to protect the smaller constrained space. Same noise has LESS relative impact. SNR improves by factor of 1 over 1-minus-theta. With theta equals 0.37, that's 2.7 times better privacy-utility!
        
        Section 4: This is our key novelty. The chain is: Domain ontologies provide 5,247 semantic entities. SPARQL extraction produces 3,000 constraint rules. Space projection achieves 63% reduction. And this directly translates to 2.7 times privacy improvement.
        
        This is the first work showing that domain knowledge encoded as semantic constraints directly amplifies differential privacy - without modifying the DP mechanism itself! Previous approaches like gradient clipping achieve only 10% reduction, subspace learning gets 25% at best. Our semantic approach achieves 63%.
        
        Section 5: What if we skip this step? The impact is catastrophic. With hypothesis space reduction, at epsilon equals 10, we lose only 3.7% utility. Without it, utility loss jumps to 12.1% - that's 3.3 times worse! Convergence slows from 32 to 41 rounds. Constraint satisfaction drops from 94% to 67%.
        
        The cascade effect is dangerous: full space requires more noise, more noise corrupts gradient signals, the model learns physically impossible patterns, predictions violate domain constraints, and the system becomes unsafe for deployment.
        
        Real-world example: Without HSR, a tool wear model might predict wear decreasing from 0.85 to 0.72 - physically impossible! Maintenance gets skipped, the tool breaks, production halts, fifty thousand dollar loss. With HSR, the model is constrained: wear can only increase. It correctly predicts 0.91, maintenance happens on time, zero downtime.
        
        In summary: Hypothesis space reduction is not optional - it's the foundation that makes privacy-preserving federated learning actually work in practice.`,
        highlights: []
    },

    21: {
        text: `Here are our privacy-utility experimental results.
        
        At epsilon equals 100, minimal privacy, SCFA loses only 0.8% utility versus 2.1% for FedAvg, a 2.6 times improvement.
        
        At epsilon equals 10, which is GDPR-compatible, SCFA loses only 3.7% utility versus 12.1% for FedAvg. That's a 3.3 times improvement! This is the sweet spot for real deployments.
        
        At epsilon equals 1, moderate privacy, SCFA loses 8.7% versus 23.9%, a 2.7 times improvement.
        
        Even at epsilon equals 0.1, very strong privacy, SCFA loses 23.3% versus 43.9%, still a 1.9 times improvement.
        
        Our final measurements show theta equals 0.37 for space reduction, 31.5% signal-to-noise ratio improvement, and only 7.5% prediction error.
        
        For executives, this means you can now deploy privacy-preserving AI that actually works - GDPR-compliant with only 3.7% accuracy loss!`,
        highlights: [
            {stat: "eps-100", delay: 3000},
            {stat: "scfa-100", delay: 4500},
            {stat: "imp-100", delay: 6000},
            {stat: "eps-10", delay: 8000},
            {stat: "scfa-10", delay: 9500},
            {stat: "imp-10", delay: 11000},
            {stat: "eps-1", delay: 14000},
            {stat: "scfa-1", delay: 15500},
            {stat: "imp-1", delay: 17000},
            {stat: "eps-01", delay: 19000},
            {stat: "scfa-01", delay: 20500},
            {stat: "imp-01", delay: 22000},
            {stat: "theta-final", delay: 25000},
            {stat: "snr", delay: 27000}
        ]
    },

    22: {
        text: `Research Question 3: How does constraint violation rate correlate with model performance?
        
        The answer is clean and actionable: it's a linear relationship with R-squared equals 0.93. And there's a critical threshold at 18% - above this, performance collapses catastrophically!
        
        Look at the architecture diagram. You can see the green safe zone where violations are below 5%, the yellow warning zone from 5 to 10%, and the red danger zone approaching 18%.
        
        Beyond 18%, the model doesn't just degrade linearly - it collapses. This gives us clear operational thresholds for real-world deployment.`,
        highlights: [
            {stat: "critical", delay: 5000},
            {stat: "rq3-rsq", delay: 8000}
        ]
    },

    23: {
        text: `Our Proposition 1 establishes the violation-performance formula.
        
        Model Loss equals 0.12, which is F-star, the best achievable with centralized training, plus 0.03, which is epsilon-opt, the optimization overhead from being distributed, plus rho times 0.45, the violation penalty.
        
        This means every 1% increase in constraint violations costs you approximately 0.45% in model performance.
        
        This gives us clear operational thresholds. Keep violations below 5% and you're in the safe zone. Between 5 and 10% is the warning zone. Between 10 and 18% is the danger zone. And above 18%, this is the critical number, performance collapses nonlinearly.
        
        Think of it like driving. A few minor infractions are okay. But past a certain point, everything breaks down. The 18% threshold is like the speed at which you lose control.`,
        highlights: [
            {stat: "f-star", delay: 4000},
            {stat: "epsilon-opt", delay: 7000},
            {stat: "penalty-coef", delay: 10000},
            {stat: "rule-pct", delay: 14000},
            {stat: "rule-cost", delay: 16000},
            {stat: "safe-range", delay: 20000},
            {stat: "warn-range", delay: 22000},
            {stat: "danger-range", delay: 24000},
            {stat: "collapse-range", delay: 26000},
            {stat: "rho-crit", delay: 28000}
        ]
    },

    24: {
        text: `Let me show you which constraints matter most.
        
        Temporal monotonicity - the rule that tool wear only increases - has an impact coefficient of 0.62, which is 1.38 times the impact of other constraints. This is the highest priority to enforce!
        
        Causal precedence has a coefficient of 0.48, about 1.07 times the baseline. Capacity bounds have 0.31 at 0.69 times. Physical laws have 0.21 at 0.47 times.
        
        Here's the actionable insight: if you have limited resources, prioritize time-based constraints first!
        
        Looking at performance levels: below 5% violations you achieve F1 of 0.85, that's 95% of optimal. From 5 to 10% you get 0.81, 90% optimal. From 10 to 18% you get 0.77, 85% optimal. And above 18%, F1 drops to just 0.31 - catastrophic collapse!
        
        For executives, you now have clear alert thresholds for production monitoring - set alarms at 5% and emergency at 18%.`,
        highlights: [
            {stat: "temporal-coef", delay: 4000},
            {stat: "temporal-rel", delay: 6000},
            {stat: "causal-coef", delay: 9000},
            {stat: "capacity-coef", delay: 12000},
            {stat: "physical-coef", delay: 15000},
            {stat: "perf-safe-range", delay: 22000},
            {stat: "perf-safe", delay: 24000},
            {stat: "perf-warn", delay: 27000},
            {stat: "perf-danger", delay: 30000},
            {stat: "perf-crit-range", delay: 33000},
            {stat: "perf-crit", delay: 35000}
        ]
    },

    25: {
        text: `Let me summarize our key results.
        
        Research Question 1 on convergence: 22% faster, going from 41 to just 32 rounds under moderate heterogeneity. Theorem 1 validated with R-squared equals 0.94.
        
        Research Question 2 on privacy: 2.7 times better privacy-utility tradeoff, with only 3.7% loss versus 12.1% at epsilon equals 10. Theorem 2 showed theta equals 0.37, a 63% space reduction.
        
        Research Question 3 on violations: 18% critical threshold with linear degradation until catastrophic collapse. Proposition 1 validated with R-squared equals 0.93.
        
        All three theorems validated with R-squared greater than 0.90 - our theory matches practice!
        
        For the research community, we've established the first formal convergence theory for constraint-based federated learning.
        
        For practitioners, this is deployable today with a 16 megabyte model size that fits on edge devices, 87 millisecond inference time for real-time monitoring, and only 0.29% computational overhead from constraint checking.`,
        highlights: [
            {stat: "sum-conv", delay: 3000},
            {stat: "sum-rounds", delay: 5000},
            {stat: "sum-r1", delay: 7000},
            {stat: "sum-priv", delay: 10000},
            {stat: "sum-loss", delay: 12000},
            {stat: "sum-theta", delay: 14000},
            {stat: "sum-thresh", delay: 17000},
            {stat: "sum-r3", delay: 20000},
            {stat: "all-rsq", delay: 23000},
            {stat: "model-size", delay: 32000},
            {stat: "inference", delay: 34000},
            {stat: "overhead", delay: 36000}
        ]
    },

    26: {
        text: `Now let me walk you through the technical implementation details.
        
        First, facility simulation. We used comprehensive Python programming to simulate five geographically distributed manufacturing facilities. The key is Dirichlet partitioning - we used the Flower framework for federated learning orchestration, combined with PyTorch neural networks.
        
        The Dirichlet distribution parameter alpha controls heterogeneity. Alpha approaching infinity gives IID data, while alpha approaching zero creates extreme non-IID conditions. We tested with alpha equals 0.1, 1.0, and 10.0.
        
        For data collection, we built an automated pipeline using our download_all_data.sh script. It includes URL verification with curl, Git repository validation, and color-coded logging. The primary training data is the Bosch Production dataset from Kaggle - 750 megabytes with 968 features.
        
        For the Knowledge Graph, we used rdflib and owlready2 to parse OWL and RDF ontologies. We merged ISA-95, MASON, NIST AM, and Schema.org ontologies, ran OWL reasoners like HermiT for inference, then extracted constraints via SPARQL queries.
        
        The full tech stack includes Flower for FL, PyTorch for models, Opacus for differential privacy, NetworkX for graph analysis, and Weights & Biases for experiment tracking.
        
        The complete implementation is available on GitHub at github.com/jahidul-arafat/Semantic-Constrained-Federated-Aggregation. Feel free to explore, contribute, or reach out with questions!`,
        highlights: []
    },

    27: {
        text: `Let me discuss the broader implications of our framework.
        
        This framework generalizes beyond manufacturing. Anywhere you have structured domain knowledge, you can integrate it into federated learning with formal guarantees.
        
        In Healthcare, you have medical ontologies like SNOMED-CT and ICD-10, treatment protocols, and drug interaction rules.
        
        In Finance, you have regulatory rules like Basel III, risk constraints, and compliance requirements.
        
        For Autonomous Systems, you have safety specifications like ISO 26262 and DO-178C, physical constraints, and operational bounds.
        
        The theoretical framework is domain-agnostic. The practical challenge is constructing appropriate knowledge graphs, which varies by domain maturity.
        
        The key insight is profound: domain knowledge doesn't just help machine learning - it fundamentally changes the mathematics by reducing heterogeneity and constraining the hypothesis space.`,
        highlights: []
    },

    28: {
        text: `Before we conclude, let me address some questions that reviewers typically ask about this work.
        
        On novelty: Unlike existing methods like FedProx and SCAFFOLD that treat FL as a pure optimization problem, SCFA leverages domain semantics to constrain the hypothesis space. This is the first formal convergence theory for constraint-based federated learning.
        
        On theoretical assumptions: Our convergence theorem requires L-smoothness, bounded gradient variance, and convex constraint sets. These are standard assumptions in the FL literature, and our constraint types - temporal, causal, capacity, and physical - all satisfy convexity requirements.
        
        On experimental methodology: We tested on the Bosch dataset with 1.18 million samples, validated on NASA C-MAPSS and UCI SECOM, used Dirichlet partitioning with alpha from 0.1 to 10, and compared against FedAvg, FedProx, SCAFFOLD, FedNova, and FedDyn with 5 runs per configuration.
        
        On computational overhead: Constraint checking adds only 0.29% compute time per round. It's embarrassingly parallel and operates on outputs, not parameters, so it scales to any model size.
        
        On privacy: Constraint projection is post-processing on already-privatized gradients, so ε-differential privacy is preserved. Better yet, Theorem 2 shows we need 63% less noise for the same privacy level.
        
        On limitations: Yes, SCFA requires domain knowledge. It's designed for domains with rich semantic structure like manufacturing, healthcare, and finance - not for unconstrained image classification.
        
        The complete FAQ is available in this slide for your reference.`,
        highlights: []
    },

    29: {
        text: `Let me close where I started - with those five manufacturing plants.
        
        With SCFA, they can now train models 22% faster, reducing communication costs. They can maintain privacy that actually works - not just on paper. And they have clear warning signs when something goes wrong.
        
        But more broadly, we've shown something fundamental: domain knowledge isn't just helpful for machine learning - it changes the mathematics.
        
        We've made our complete implementation publicly available: 1.18 million samples, 750 megabytes of data, and 3,000 constraints - all available for research.
        
        Thank you for your attention. I'm Jahidul Arafat, Presidential and Woltosz Graduate Research Fellow at Auburn University.
        
        I'm happy to take questions.`,
        highlights: [
            {stat: "close-conv", delay: 4000},
            {stat: "open-samples", delay: 22000},
            {stat: "open-size", delay: 24000},
            {stat: "open-constraints", delay: 26000}
        ]
    }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initSceneNav();
    initVoiceSelector();
    initDraggableControls();
    updateProgress();
    updateNarrationIndicator();
    animateScene(0);
    
    const speechRateSlider = document.getElementById('speechRate');
    if (speechRateSlider) {
        speechRateSlider.addEventListener('input', updateSpeechRate);
    }
});

// ============================================
// DRAGGABLE AUDIO CONTROLS
// ============================================
function initDraggableControls() {
    const audioControls = document.getElementById('audioControls');
    if (!audioControls) return;
    
    let isDragging = false;
    let startX, startY, startLeft, startBottom;
    
    audioControls.addEventListener('mousedown', startDrag);
    audioControls.addEventListener('touchstart', startDrag, { passive: false });
    
    function startDrag(e) {
        // Don't drag if clicking on interactive elements
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || 
            e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') return;
        
        isDragging = true;
        audioControls.classList.add('dragging');
        
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        
        const rect = audioControls.getBoundingClientRect();
        startLeft = rect.left;
        startBottom = window.innerHeight - rect.bottom;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);
        
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        let newLeft = startLeft + deltaX;
        let newBottom = startBottom - deltaY;
        
        // Keep within bounds
        const maxLeft = window.innerWidth - audioControls.offsetWidth - 10;
        const maxBottom = window.innerHeight - audioControls.offsetHeight - 10;
        
        newLeft = Math.max(10, Math.min(newLeft, maxLeft));
        newBottom = Math.max(10, Math.min(newBottom, maxBottom));
        
        audioControls.style.left = newLeft + 'px';
        audioControls.style.bottom = newBottom + 'px';
        audioControls.style.right = 'auto';
        audioControls.style.top = 'auto';
        
        e.preventDefault();
    }
    
    function stopDrag() {
        isDragging = false;
        audioControls.classList.remove('dragging');
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', stopDrag);
    }
}

// ============================================
// STATISTICS HIGHLIGHTING
// ============================================
function highlightStat(statId) {
    const elements = document.querySelectorAll(`[data-stat="${statId}"]`);
    elements.forEach(el => {
        el.classList.add('speaking');
        // Scroll into view if needed
        if (!isElementInViewport(el)) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

function clearStatHighlight(statId) {
    const elements = document.querySelectorAll(`[data-stat="${statId}"]`);
    elements.forEach(el => el.classList.remove('speaking'));
}

function clearAllHighlights() {
    document.querySelectorAll('.stat-highlight.speaking').forEach(el => {
        el.classList.remove('speaking');
    });
    highlightTimers.forEach(timer => clearTimeout(timer));
    highlightTimers = [];
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function scheduleHighlights(highlights) {
    clearAllHighlights();
    
    highlights.forEach(h => {
        const timer = setTimeout(() => {
            if (isNarrating && !isPaused) {
                highlightStat(h.stat);
                // Auto-clear after 3 seconds
                setTimeout(() => clearStatHighlight(h.stat), 3000);
            }
        }, h.delay);
        highlightTimers.push(timer);
    });
}

// ============================================
// EQUATION ANIMATIONS
// ============================================
function animateEquation(equationId) {
    const equation = document.getElementById(equationId);
    if (!equation) return;
    
    const components = equation.querySelectorAll('.eq-component');
    const operators = equation.querySelectorAll('.eq-operator');
    
    let delay = 0;
    components.forEach((comp, i) => {
        setTimeout(() => {
            comp.classList.add('active');
            if (operators[i]) operators[i].classList.add('active');
        }, delay);
        delay += 1500;
    });
}

// ============================================
// NARRATION INDICATOR
// ============================================
function updateNarrationIndicator() {
    const indicator = document.getElementById('narrationIndicator');
    const sceneNum = document.getElementById('narratingSceneNum');
    const sceneTitle = document.getElementById('narratingSceneTitle');
    const syncWarning = document.getElementById('syncWarning');
    const syncSceneNum = document.getElementById('syncSceneNum');
    
    if (!indicator) return;
    
    if (narratingScene >= 0 && isNarrating) {
        const scene = scenes[narratingScene];
        const title = scene ? scene.getAttribute('data-title') : `Scene ${narratingScene}`;
        sceneNum.textContent = narratingScene;
        sceneTitle.textContent = title;
        
        if (narratingScene === currentScene) {
            indicator.className = 'narration-indicator synced';
            syncWarning.classList.add('hidden');
        } else {
            indicator.className = 'narration-indicator out-of-sync';
            syncWarning.classList.remove('hidden');
            syncSceneNum.textContent = narratingScene;
        }
    } else {
        sceneNum.textContent = '--';
        sceneTitle.textContent = isPaused ? 'Paused' : (narrationEnabled ? 'Ready' : 'Off');
        indicator.className = 'narration-indicator idle';
        syncWarning.classList.add('hidden');
    }
}

function setNarratingScene(sceneIndex) {
    narratingScene = sceneIndex;
    isNarrating = true;
    updateNarrationIndicator();
}

function clearNarratingScene() {
    isNarrating = false;
    clearAllHighlights();
    updateNarrationIndicator();
}

// ============================================
// VOICE SELECTION
// ============================================
function initVoiceSelector() {
    const audioControls = document.querySelector('.audio-controls');
    if (audioControls && !document.getElementById('voiceSelector')) {
        const voiceSelect = document.createElement('select');
        voiceSelect.id = 'voiceSelector';
        voiceSelect.innerHTML = '<option value="">Loading...</option>';
        voiceSelect.onchange = () => selectVoice(voiceSelect.value);
        
        const rateLabel = audioControls.querySelector('.rate-label');
        if (rateLabel) {
            audioControls.insertBefore(voiceSelect, rateLabel);
        } else {
            audioControls.appendChild(voiceSelect);
        }
    }
    
    loadVoices();
    if (speechSynth) speechSynth.onvoiceschanged = loadVoices;
}

function loadVoices() {
    if (!speechSynth) return;
    
    availableVoices = speechSynth.getVoices();
    const voiceSelect = document.getElementById('voiceSelector');
    if (!voiceSelect || availableVoices.length === 0) return;
    
    const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
    const maleNames = ['David', 'Daniel', 'James', 'Google UK English Male', 'Alex', 'Tom', 'Fred', 'Guy', 'Lee', 'Gordon', 'Rishi'];
    const femaleNames = ['Samantha', 'Victoria', 'Karen', 'Google UK English Female', 'Fiona', 'Zoe', 'Ava', 'Kate', 'Serena'];
    
    const categorize = (v) => {
        if (maleNames.some(n => v.name.includes(n))) return 'male';
        if (femaleNames.some(n => v.name.includes(n))) return 'female';
        if (v.name.toLowerCase().includes('male')) return 'male';
        if (v.name.toLowerCase().includes('female')) return 'female';
        return 'other';
    };
    
    let maleVoices = englishVoices.filter(v => categorize(v) === 'male');
    let femaleVoices = englishVoices.filter(v => categorize(v) === 'female');
    let otherVoices = englishVoices.filter(v => categorize(v) === 'other');
    
    let html = '<optgroup label="🎤 Male">';
    maleVoices.forEach(v => {
        const shortName = v.name.replace('Microsoft ', '').replace('Google ', '').replace(' (English (United Kingdom))', ' UK').replace(' (English (United States))', ' US').replace('English', '').substring(0, 18);
        html += `<option value="${v.name}">${shortName}</option>`;
    });
    html += '</optgroup><optgroup label="👩 Female">';
    femaleVoices.forEach(v => {
        const shortName = v.name.replace('Microsoft ', '').replace('Google ', '').replace(' (English (United Kingdom))', ' UK').replace(' (English (United States))', ' US').replace('English', '').substring(0, 18);
        html += `<option value="${v.name}">${shortName}</option>`;
    });
    html += '</optgroup>';
    if (otherVoices.length) {
        html += '<optgroup label="🔊 Other">';
        otherVoices.forEach(v => {
            const shortName = v.name.replace(' (English (United Kingdom))', ' UK').replace(' (English (United States))', ' US').substring(0, 18);
            html += `<option value="${v.name}">${shortName}</option>`;
        });
        html += '</optgroup>';
    }
    
    voiceSelect.innerHTML = html;
    
    const preferred = ['Google UK English Male', 'Microsoft David', 'Daniel', 'David', 'Alex'];
    let defaultVoice = null;
    for (const p of preferred) {
        defaultVoice = availableVoices.find(v => v.name.includes(p));
        if (defaultVoice) break;
    }
    if (!defaultVoice && maleVoices.length) defaultVoice = maleVoices[0];
    if (!defaultVoice && englishVoices.length) defaultVoice = englishVoices[0];
    
    if (defaultVoice) {
        voiceSelect.value = defaultVoice.name;
        selectedVoice = defaultVoice;
    }
}

function selectVoice(voiceName) {
    selectedVoice = availableVoices.find(v => v.name === voiceName) || null;
    if (narrationEnabled && !isPaused && isNarrating) {
        resyncNarration();
    }
}

// ============================================
// SCENE NAVIGATION
// ============================================
function initSceneNav() {
    scenes.forEach((scene, index) => {
        const dot = document.createElement('div');
        dot.className = 'scene-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('data-title', scene.getAttribute('data-title') || `Scene ${index + 1}`);
        dot.onclick = () => goToScene(index);
        sceneNav.appendChild(dot);
    });
}

function updateProgress() {
    const progress = ((currentScene + 1) / totalScenes) * 100;
    progressBar.style.width = progress + '%';
    
    document.querySelectorAll('.scene-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentScene);
    });
    
    prevBtn.disabled = currentScene === 0;
    nextBtn.disabled = currentScene === totalScenes - 1;
    nextBtn.textContent = currentScene === totalScenes - 1 ? 'End' : 'Next →';
}

// ============================================
// SCENE ANIMATIONS
// ============================================
function animateScene(sceneIndex) {
    const scene = scenes[sceneIndex];
    
    setTimeout(() => {
        scene.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));
    }, 100);
    
    const animateWithDelay = (selector, baseDelay) => {
        scene.querySelectorAll(selector).forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), parseInt(el.getAttribute('data-delay') || i * 200) + baseDelay);
        });
    };
    
    animateWithDelay('.facility', 300);
    animateWithDelay('.problem-card', 300);
    animateWithDelay('.source-card', 400);
    animateWithDelay('.algo-step', 400);
    animateWithDelay('.rq-card', 300);
    animateWithDelay('.animate-row', 500);
    animateWithDelay('.summary-card', 400);
    animateWithDelay('.domain-card', 400);
    animateWithDelay('.benefit-item', 500);
    
    scene.querySelectorAll('.animate-item').forEach(el => {
        setTimeout(() => el.classList.add('visible'), parseInt(el.getAttribute('data-delay') || 500));
    });
    
    // Initialize example carousels for Scene 1 (What is SCFA?)
    if (sceneIndex === 1) {
        setTimeout(() => {
            if (typeof initExampleCarousels === 'function') {
                initExampleCarousels();
            }
        }, 500);
    } else {
        // Stop auto-play when leaving Scene 1
        if (typeof stopExampleAutoPlay === 'function') {
            stopExampleAutoPlay();
        }
    }
    
    if (narrationEnabled && !isNarrating) {
        setTimeout(() => narrateScene(sceneIndex), 800);
    } else {
        updateNarrationIndicator();
    }
}

function resetScene(sceneIndex) {
    const scene = scenes[sceneIndex];
    scene.querySelectorAll('.animate-in, .facility, .problem-card, .animate-item, .source-card, .algo-step, .rq-card, .animate-row, .summary-card, .domain-card, .benefit-item').forEach(el => {
        el.classList.remove('visible');
    });
    scene.querySelectorAll('.eq-component, .eq-operator').forEach(el => el.classList.remove('active'));
}

function goToScene(index) {
    if (index < 0 || index >= totalScenes || index === currentScene || isPaused) return;
    
    scenes[currentScene].classList.remove('active');
    scenes[currentScene].classList.add('exit');
    resetScene(currentScene);
    
    setTimeout(() => {
        scenes[currentScene].classList.remove('exit');
        currentScene = index;
        scenes[currentScene].classList.add('active');
        animateScene(currentScene);
        updateProgress();
        updateNarrationIndicator();
        scenes[currentScene].scrollTop = 0;
        
        // Initialize Hypothesis Space Reduction animations for scene 20
        if (index === 20 && typeof initHSRAnimations === 'function') {
            setTimeout(initHSRAnimations, 300);
        }
    }, 300);
}

function nextScene() { if (currentScene < totalScenes - 1) goToScene(currentScene + 1); }
function prevScene() { if (currentScene > 0) goToScene(currentScene - 1); }
function startPresentation() { goToScene(1); }

// ============================================
// PAUSE/RESUME
// ============================================
function togglePause() {
    isPaused = !isPaused;
    pauseBtn.innerHTML = isPaused ? '▶ Resume' : '⏸ Pause';
    if (isPaused) {
        pauseNarration();
        clearAllHighlights();
    } else {
        resumeNarration();
    }
    updateNarrationIndicator();
}

// ============================================
// NARRATION FUNCTIONS
// ============================================
function narrateScene(sceneIndex) {
    if (!narrationEnabled || !speechSynth) return;
    
    const scriptData = speechScripts[sceneIndex];
    if (scriptData) {
        setNarratingScene(sceneIndex);
        speak(scriptData.text, sceneIndex);
        if (scriptData.highlights && scriptData.highlights.length > 0) {
            scheduleHighlights(scriptData.highlights);
        }
    }
}

function speak(text, sceneIndex) {
    if (!speechSynth) return;
    
    speechSynth.cancel();
    
    const cleanText = text.replace(/\s+/g, ' ').replace(/—/g, ' - ').replace(/\n\s*\n/g, '. ').trim();
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    let chunks = [];
    let currentChunk = '';
    
    sentences.forEach(sentence => {
        if ((currentChunk + sentence).length < 200) {
            currentChunk += sentence;
        } else {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = sentence;
        }
    });
    if (currentChunk) chunks.push(currentChunk.trim());
    
    let chunkIndex = 0;
    
    function speakNextChunk() {
        if (chunkIndex >= chunks.length || !narrationEnabled || isPaused) {
            if (chunkIndex >= chunks.length) clearNarratingScene();
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
        utterance.rate = speechRate;
        utterance.pitch = 1;
        utterance.volume = 1;
        if (selectedVoice) utterance.voice = selectedVoice;
        
        utterance.onend = () => {
            chunkIndex++;
            setTimeout(speakNextChunk, 150);
        };
        utterance.onerror = () => {
            chunkIndex++;
            speakNextChunk();
        };
        
        currentUtterance = utterance;
        speechSynth.speak(utterance);
    }
    
    speakNextChunk();
}

function stopNarration() {
    if (speechSynth) speechSynth.cancel();
    clearNarratingScene();
}

function pauseNarration() { if (speechSynth) speechSynth.pause(); }
function resumeNarration() { if (speechSynth) speechSynth.resume(); }

function resyncNarration() {
    stopNarration();
    setTimeout(() => {
        if (narrationEnabled) narrateScene(currentScene);
    }, 100);
}

function toggleNarration() {
    narrationEnabled = !narrationEnabled;
    
    if (audioBtn) {
        audioBtn.classList.toggle('off', !narrationEnabled);
        audioBtn.innerHTML = `<span id="audioIcon">${narrationEnabled ? '🔊' : '🔇'}</span> Narration: ${narrationEnabled ? 'ON' : 'OFF'}`;
    }
    
    if (!narrationEnabled) {
        stopNarration();
    } else {
        narrateScene(currentScene);
    }
    updateNarrationIndicator();
}

function updateSpeechRate() {
    const slider = document.getElementById('speechRate');
    const rateValue = document.getElementById('rateValue');
    if (slider) {
        speechRate = parseFloat(slider.value);
        if (rateValue) rateValue.textContent = speechRate + 'x';
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
            e.preventDefault();
            if (!isPaused) nextScene();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (!isPaused) prevScene();
            break;
        case 'p':
        case 'P':
            togglePause();
            break;
        case 'n':
        case 'N':
            toggleNarration();
            break;
        case 'Escape':
            if (isPaused) togglePause();
            break;
        case 'Home':
            e.preventDefault();
            goToScene(0);
            break;
        case 'End':
            e.preventDefault();
            goToScene(totalScenes - 1);
            break;
        case 'r':
        case 'R':
        case 's':
        case 'S':
            resyncNarration();
            break;
    }
});

// ============================================
// TOUCH/SWIPE
// ============================================
let touchStartX = 0, touchEndX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) nextScene();
        else prevScene();
    }
}, { passive: true });

// ============================================
// UTILITIES
// ============================================
function preloadImages() {
    ['images/rq1_architecture.png', 'images/rq2_architecture.png', 'images/rq3_architecture.png'].forEach(src => {
        const img = new Image();
        img.src = src;
    });
}
window.addEventListener('load', preloadImages);

document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseNarration();
    else if (!isPaused && narrationEnabled) resumeNarration();
    updateNarrationIndicator();
});

// ============================================
// HYPOTHESIS SPACE REDUCTION ANIMATIONS
// ============================================
function initHSRAnimations() {
    // Animate points disappearing from invalid regions
    const invalidPoints = document.querySelectorAll('.hypothesis-space .point.invalid');
    const constrainedRegion = document.getElementById('constrainedRegion');
    
    // Phase 1: Highlight the full space
    setTimeout(() => {
        const fullSpace = document.getElementById('fullSpace');
        if (fullSpace) {
            fullSpace.style.transition = 'all 0.5s ease';
            fullSpace.style.boxShadow = '0 0 30px rgba(244, 67, 54, 0.5)';
        }
    }, 500);
    
    // Phase 2: Fade out invalid points one by one
    invalidPoints.forEach((point, i) => {
        setTimeout(() => {
            point.style.transition = 'all 0.5s ease';
            point.style.opacity = '0.1';
            point.style.transform = 'scale(0.5)';
        }, 2000 + (i * 300));
    });
    
    // Phase 3: Highlight the constrained region
    setTimeout(() => {
        if (constrainedRegion) {
            constrainedRegion.style.transition = 'all 0.5s ease';
            constrainedRegion.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.7)';
            constrainedRegion.style.transform = 'scale(1.1)';
        }
    }, 5000);
    
    // Phase 4: Animate process steps
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, i) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            step.style.transition = 'all 0.5s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
        }, 1000 + (i * 800));
    });
    
    // Phase 5: Animate factor cards
    const factorCards = document.querySelectorAll('.factor-card');
    factorCards.forEach((card, i) => {
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            
            // Animate the impact bar inside
            const impactBar = card.querySelector('.impact-bar');
            if (impactBar) {
                const targetWidth = impactBar.style.width;
                impactBar.style.width = '0%';
                setTimeout(() => {
                    impactBar.style.transition = 'width 1s ease';
                    impactBar.style.width = targetWidth;
                }, 100);
            }
            
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 300);
        }, 8000 + (i * 500));
    });
    
    // Phase 6: Animate the cascade flow
    const cascadeItems = document.querySelectorAll('.cascade-item');
    const cascadeArrows = document.querySelectorAll('.cascade-arrow');
    
    cascadeItems.forEach((item, i) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100);
        }, 15000 + (i * 400));
    });
    
    cascadeArrows.forEach((arrow, i) => {
        setTimeout(() => {
            arrow.style.opacity = '0';
            setTimeout(() => {
                arrow.style.transition = 'opacity 0.3s ease';
                arrow.style.opacity = '1';
            }, 100);
        }, 15200 + (i * 400));
    });
    
    // Phase 7: Highlight novelty stages
    const noveltyStages = document.querySelectorAll('.novelty-stage');
    noveltyStages.forEach((stage, i) => {
        setTimeout(() => {
            stage.style.transition = 'all 0.3s ease';
            stage.style.borderColor = '#4caf50';
            stage.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                if (!stage.classList.contains('highlight-stage')) {
                    stage.style.transform = 'scale(1)';
                    stage.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }
            }, 800);
        }, 12000 + (i * 600));
    });
    
    // Phase 8: Animate comparison scenarios
    const scenarios = document.querySelectorAll('.scenario');
    scenarios.forEach((scenario, i) => {
        setTimeout(() => {
            scenario.style.transition = 'all 0.5s ease';
            scenario.style.transform = 'scale(1.02)';
            scenario.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            
            setTimeout(() => {
                scenario.style.transform = 'scale(1)';
            }, 500);
        }, 18000 + (i * 1000));
    });
}

// ============================================
// KNOWLEDGE GRAPH (vis.js)
// ============================================
let kgNetwork = null;
let kgNodes = null;
let kgEdges = null;
let isCustomMode = false;
let physicsEnabled = true;
let customNodeId = 100;
let customEdgeId = 100;

// Node colors by type
const nodeColors = {
    equipment: { background: '#2196f3', border: '#1565c0', highlight: { background: '#42a5f5', border: '#1976d2' }},
    sensor: { background: '#009688', border: '#00796b', highlight: { background: '#26a69a', border: '#00897b' }},
    process: { background: '#ff9800', border: '#ef6c00', highlight: { background: '#ffa726', border: '#f57c00' }},
    failure: { background: '#e91e63', border: '#c2185b', highlight: { background: '#ec407a', border: '#d81b60' }},
    prediction: { background: '#4caf50', border: '#2e7d32', highlight: { background: '#66bb6a', border: '#388e3c' }},
    constraint: { background: '#9c27b0', border: '#7b1fa2', highlight: { background: '#ab47bc', border: '#8e24aa' }},
    custom: { background: '#607d8b', border: '#455a64', highlight: { background: '#78909c', border: '#546e7a' }}
};

// Edge colors by type
const edgeColors = {
    structural: { color: '#888', highlight: '#aaa' },
    causal: { color: '#ff9800', highlight: '#ffa726' },
    temporal: { color: '#2196f3', highlight: '#42a5f5' },
    constraint: { color: '#9c27b0', highlight: '#ab47bc' }
};

// Default SCFA Research Graph Data
const defaultNodes = [
    // Core Equipment Layer
    { id: 1, label: 'Manufacturing\nFacility', group: 'equipment', title: 'Root manufacturing facility node' },
    { id: 2, label: 'CNC Machine', group: 'equipment', title: 'Computer Numerical Control machine' },
    { id: 3, label: 'Assembly Line', group: 'equipment', title: 'Production assembly line' },
    { id: 4, label: 'Robot Arm', group: 'equipment', title: 'Industrial robot manipulator' },
    
    // Sensor Layer
    { id: 5, label: 'Temperature\nSensor', group: 'sensor', title: 'Monitors thermal conditions' },
    { id: 6, label: 'Vibration\nSensor', group: 'sensor', title: 'Monitors mechanical vibrations' },
    { id: 7, label: 'Pressure\nSensor', group: 'sensor', title: 'Monitors hydraulic/pneumatic pressure' },
    { id: 8, label: 'Current\nSensor', group: 'sensor', title: 'Monitors electrical current draw' },
    
    // Process/State Layer
    { id: 9, label: 'Tool Wear', group: 'process', title: 'Cumulative tool degradation state' },
    { id: 10, label: 'Spindle\nSpeed', group: 'process', title: 'Rotational velocity of spindle' },
    { id: 11, label: 'Feed Rate', group: 'process', title: 'Material advancement rate' },
    { id: 12, label: 'Cutting\nForce', group: 'process', title: 'Force applied during cutting' },
    { id: 13, label: 'Surface\nQuality', group: 'process', title: 'Finished surface roughness' },
    
    // Failure Layer
    { id: 14, label: 'Tool\nBreakage', group: 'failure', title: 'Catastrophic tool failure' },
    { id: 15, label: 'Overheating', group: 'failure', title: 'Thermal limit exceeded' },
    { id: 16, label: 'Vibration\nAnomaly', group: 'failure', title: 'Abnormal vibration pattern' },
    { id: 17, label: 'Motor\nFailure', group: 'failure', title: 'Drive motor malfunction' },
    
    // Prediction/Output Layer
    { id: 18, label: 'Failure\nPrediction', group: 'prediction', title: 'ML model output: failure probability' },
    { id: 19, label: 'RUL\nEstimate', group: 'prediction', title: 'Remaining Useful Life estimate' },
    { id: 20, label: 'Maintenance\nSchedule', group: 'prediction', title: 'Optimal maintenance timing' },
    
    // Constraint Nodes
    { id: 21, label: 'Temporal\nConstraint', group: 'constraint', title: '∂(wear)/∂t ≥ 0: Wear only increases' },
    { id: 22, label: 'Causal\nConstraint', group: 'constraint', title: 'Wear → Failure ordering' },
    { id: 23, label: 'Capacity\nConstraint', group: 'constraint', title: 'T ∈ [Tmin, Tmax]' },
    { id: 24, label: 'Physical\nConstraint', group: 'constraint', title: 'Energy conservation' }
];

const defaultEdges = [
    // Structural: Equipment hierarchy
    { from: 1, to: 2, label: 'contains', edgeType: 'structural' },
    { from: 1, to: 3, label: 'contains', edgeType: 'structural' },
    { from: 1, to: 4, label: 'contains', edgeType: 'structural' },
    
    // Structural: Equipment-Sensor
    { from: 2, to: 5, label: 'hasComponent', edgeType: 'structural' },
    { from: 2, to: 6, label: 'hasComponent', edgeType: 'structural' },
    { from: 2, to: 7, label: 'hasComponent', edgeType: 'structural' },
    { from: 2, to: 8, label: 'hasComponent', edgeType: 'structural' },
    
    // Temporal: Sensor-Process monitoring
    { from: 5, to: 9, label: 'monitors', edgeType: 'temporal' },
    { from: 6, to: 9, label: 'monitors', edgeType: 'temporal' },
    { from: 8, to: 10, label: 'monitors', edgeType: 'temporal' },
    { from: 7, to: 11, label: 'monitors', edgeType: 'temporal' },
    
    // Process relationships
    { from: 10, to: 12, label: 'affects', edgeType: 'structural' },
    { from: 11, to: 12, label: 'affects', edgeType: 'structural' },
    { from: 12, to: 13, label: 'determines', edgeType: 'structural' },
    { from: 9, to: 13, label: 'degrades', edgeType: 'temporal' },
    
    // Causal: Process-Failure
    { from: 9, to: 14, label: 'leadsto', edgeType: 'causal', arrows: 'to', dashes: false },
    { from: 5, to: 15, label: 'triggers', edgeType: 'causal', arrows: 'to' },
    { from: 6, to: 16, label: 'indicates', edgeType: 'causal', arrows: 'to' },
    { from: 8, to: 17, label: 'predicts', edgeType: 'causal', arrows: 'to' },
    
    // Causal chains
    { from: 15, to: 14, label: 'causes', edgeType: 'causal', arrows: 'to' },
    { from: 16, to: 14, label: 'precedes', edgeType: 'causal', arrows: 'to' },
    
    // Prediction inputs
    { from: 9, to: 18, label: 'informs', edgeType: 'structural' },
    { from: 14, to: 18, label: 'informs', edgeType: 'structural' },
    { from: 15, to: 18, label: 'informs', edgeType: 'structural' },
    { from: 18, to: 19, label: 'outputs', edgeType: 'structural' },
    { from: 19, to: 20, label: 'schedules', edgeType: 'structural' },
    
    // Constraint relationships
    { from: 21, to: 9, label: 'validates', edgeType: 'constraint', dashes: true },
    { from: 22, to: 14, label: 'validates', edgeType: 'constraint', dashes: true },
    { from: 23, to: 5, label: 'bounds', edgeType: 'constraint', dashes: true },
    { from: 24, to: 8, label: 'conserves', edgeType: 'constraint', dashes: true }
];

function initKnowledgeGraph() {
    const container = document.getElementById('knowledgeGraph');
    if (!container) {
        console.error('Knowledge Graph container not found');
        return;
    }
    if (typeof vis === 'undefined') {
        console.error('vis.js library not loaded');
        return;
    }
    
    console.log('Creating Knowledge Graph in container:', container);
    
    try {
        // Create nodes DataSet
        kgNodes = new vis.DataSet(defaultNodes.map(n => ({
            ...n,
            color: nodeColors[n.group],
            font: { color: '#fff', size: 12, face: 'Segoe UI' },
            shape: 'dot',
            size: n.group === 'equipment' ? 25 : (n.group === 'constraint' ? 18 : 20),
            borderWidth: 2,
            shadow: true
        })));
        
        // Create edges DataSet
        kgEdges = new vis.DataSet(defaultEdges.map((e, i) => ({
            ...e,
            id: i + 1,
            color: edgeColors[e.edgeType],
            font: { color: '#aaa', size: 10, strokeWidth: 0, align: 'middle' },
            arrows: e.arrows || '',
            dashes: e.dashes || false,
            width: e.edgeType === 'causal' ? 2 : 1,
            smooth: { type: 'curvedCW', roundness: 0.2 }
        })));
        
        // Network options
        const options = {
            nodes: {
                font: { color: '#ffffff' }
            },
            edges: {
                font: { color: '#888888', size: 10 },
                smooth: { type: 'curvedCW', roundness: 0.2 }
            },
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -3000,
                    centralGravity: 0.3,
                    springLength: 120,
                    springConstant: 0.04,
                    damping: 0.09
                },
                stabilization: { iterations: 150 }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                navigationButtons: false,
                keyboard: false
            },
            groups: {
                equipment: { color: nodeColors.equipment },
                sensor: { color: nodeColors.sensor },
                process: { color: nodeColors.process },
                failure: { color: nodeColors.failure },
                prediction: { color: nodeColors.prediction },
                constraint: { color: nodeColors.constraint },
                custom: { color: nodeColors.custom }
            }
        };
        
        // Create network
        kgNetwork = new vis.Network(container, { nodes: kgNodes, edges: kgEdges }, options);
        console.log('Knowledge Graph network created successfully');
        
        // Update stats
        updateKGStats();
        
        // Fit after stabilization
        kgNetwork.once('stabilizationIterationsDone', function() {
            kgNetwork.fit();
        });
        
        // Event: Node click
        kgNetwork.on('click', function(params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const node = kgNodes.get(nodeId);
                console.log('Selected node:', node);
            }
        });
    } catch (error) {
        console.error('Error initializing Knowledge Graph:', error);
    }
}

function showDefaultGraph() {
    isCustomMode = false;
    document.querySelectorAll('.kg-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.kg-tab')[0].classList.add('active');
    document.getElementById('defaultLegend').style.display = 'block';
    document.getElementById('customBuilder').style.display = 'none';
    
    // Reset to default graph
    if (kgNodes && kgEdges) {
        kgNodes.clear();
        kgEdges.clear();
        kgNodes.add(defaultNodes.map(n => ({
            ...n,
            color: nodeColors[n.group],
            font: { color: '#fff', size: 12 },
            shape: 'dot',
            size: n.group === 'equipment' ? 25 : (n.group === 'constraint' ? 18 : 20),
            borderWidth: 2,
            shadow: true
        })));
        kgEdges.add(defaultEdges.map((e, i) => ({
            ...e,
            id: i + 1,
            color: edgeColors[e.edgeType],
            font: { color: '#aaa', size: 10 },
            width: e.edgeType === 'causal' ? 2 : 1
        })));
        updateKGStats();
        if (kgNetwork) kgNetwork.fit();
    }
}

function showCustomGraph() {
    isCustomMode = true;
    document.querySelectorAll('.kg-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.kg-tab')[1].classList.add('active');
    document.getElementById('defaultLegend').style.display = 'none';
    document.getElementById('customBuilder').style.display = 'block';
    
    // Clear for custom
    if (kgNodes && kgEdges) {
        kgNodes.clear();
        kgEdges.clear();
        customNodeId = 1;
        customEdgeId = 1;
        updateKGStats();
        updateEdgeSelectors();
    }
}

function addCustomNode() {
    const name = document.getElementById('nodeName').value.trim();
    const type = document.getElementById('nodeType').value;
    
    if (!name) {
        alert('Please enter a node name');
        return;
    }
    
    const newNode = {
        id: customNodeId++,
        label: name,
        group: type,
        title: `${type}: ${name}`,
        color: nodeColors[type],
        font: { color: '#fff', size: 12 },
        shape: 'dot',
        size: 20,
        borderWidth: 2,
        shadow: true
    };
    
    kgNodes.add(newNode);
    document.getElementById('nodeName').value = '';
    updateKGStats();
    updateEdgeSelectors();
    if (kgNetwork) kgNetwork.fit();
}

function addCustomEdge() {
    const from = document.getElementById('edgeFrom').value;
    const to = document.getElementById('edgeTo').value;
    const label = document.getElementById('edgeLabel').value.trim();
    const type = document.getElementById('edgeType').value;
    
    if (!from || !to) {
        alert('Please select both source and target nodes');
        return;
    }
    
    if (from === to) {
        alert('Cannot create self-loop');
        return;
    }
    
    const newEdge = {
        id: customEdgeId++,
        from: parseInt(from),
        to: parseInt(to),
        label: label || type,
        edgeType: type,
        color: edgeColors[type],
        font: { color: '#aaa', size: 10 },
        arrows: type === 'causal' ? 'to' : '',
        dashes: type === 'constraint',
        width: type === 'causal' ? 2 : 1
    };
    
    kgEdges.add(newEdge);
    document.getElementById('edgeLabel').value = '';
    updateKGStats();
}

function updateEdgeSelectors() {
    const nodes = kgNodes.get();
    const fromSelect = document.getElementById('edgeFrom');
    const toSelect = document.getElementById('edgeTo');
    
    const options = '<option value="">Select node...</option>' + 
        nodes.map(n => `<option value="${n.id}">${n.label.replace('\n', ' ')}</option>`).join('');
    
    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;
}

function clearCustomGraph() {
    if (confirm('Clear all nodes and edges?')) {
        kgNodes.clear();
        kgEdges.clear();
        customNodeId = 1;
        customEdgeId = 1;
        updateKGStats();
        updateEdgeSelectors();
    }
}

function loadSampleCustom() {
    kgNodes.clear();
    kgEdges.clear();
    customNodeId = 10;
    
    // Add sample custom nodes
    const sampleNodes = [
        { id: 1, label: 'Data Source', group: 'equipment' },
        { id: 2, label: 'Preprocessing', group: 'process' },
        { id: 3, label: 'Feature\nExtraction', group: 'process' },
        { id: 4, label: 'ML Model', group: 'prediction' },
        { id: 5, label: 'Output', group: 'prediction' },
        { id: 6, label: 'Validation', group: 'constraint' }
    ];
    
    sampleNodes.forEach(n => {
        kgNodes.add({
            ...n,
            title: n.label,
            color: nodeColors[n.group],
            font: { color: '#fff', size: 12 },
            shape: 'dot',
            size: 20,
            borderWidth: 2,
            shadow: true
        });
    });
    
    // Add sample edges
    const sampleEdges = [
        { from: 1, to: 2, label: 'feeds', edgeType: 'structural' },
        { from: 2, to: 3, label: 'transforms', edgeType: 'structural' },
        { from: 3, to: 4, label: 'inputs', edgeType: 'structural' },
        { from: 4, to: 5, label: 'produces', edgeType: 'causal' },
        { from: 6, to: 4, label: 'validates', edgeType: 'constraint' }
    ];
    
    sampleEdges.forEach((e, i) => {
        kgEdges.add({
            ...e,
            id: i + 1,
            color: edgeColors[e.edgeType],
            font: { color: '#aaa', size: 10 },
            arrows: e.edgeType === 'causal' ? 'to' : '',
            dashes: e.edgeType === 'constraint'
        });
    });
    
    updateKGStats();
    updateEdgeSelectors();
    if (kgNetwork) kgNetwork.fit();
}

function fitGraph() {
    if (kgNetwork) {
        kgNetwork.fit({ animation: true });
    } else {
        // Try to initialize if not yet done
        console.log('Graph not initialized, attempting initialization...');
        initKnowledgeGraph();
        setTimeout(() => {
            if (kgNetwork) kgNetwork.fit({ animation: true });
        }, 500);
    }
}

function togglePhysics() {
    physicsEnabled = !physicsEnabled;
    if (kgNetwork) {
        kgNetwork.setOptions({ physics: { enabled: physicsEnabled }});
    }
}

function exportGraph() {
    const data = {
        nodes: kgNodes.get(),
        edges: kgEdges.get()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'knowledge_graph.json';
    a.click();
    URL.revokeObjectURL(url);
}

function updateKGStats() {
    const nodeCount = document.getElementById('nodeCount');
    const edgeCount = document.getElementById('edgeCount');
    if (nodeCount) nodeCount.textContent = kgNodes ? kgNodes.length : 0;
    if (edgeCount) edgeCount.textContent = kgEdges ? kgEdges.length : 0;
}

// Fullscreen functionality
let isFullscreen = false;

function toggleFullscreen() {
    const container = document.getElementById('kgMainContainer');
    if (!container) return;
    
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        // Enter fullscreen
        container.classList.add('fullscreen');
        
        // Add exit button if not exists
        if (!document.getElementById('fullscreenExitBtn')) {
            const exitBtn = document.createElement('button');
            exitBtn.id = 'fullscreenExitBtn';
            exitBtn.className = 'fullscreen-exit-btn visible';
            exitBtn.innerHTML = '✕ Exit Fullscreen';
            exitBtn.onclick = toggleFullscreen;
            document.body.appendChild(exitBtn);
        } else {
            document.getElementById('fullscreenExitBtn').classList.add('visible');
        }
        
        // Add floating controls
        if (!document.getElementById('fullscreenControls')) {
            const controls = document.createElement('div');
            controls.id = 'fullscreenControls';
            controls.className = 'fullscreen-controls visible';
            controls.innerHTML = `
                <button class="kg-action-btn" onclick="fitGraph()" title="Fit to view">🔍 Fit</button>
                <button class="kg-action-btn" onclick="togglePhysics()" title="Toggle physics">⚡ Physics</button>
                <button class="kg-action-btn" onclick="exportGraph()" title="Export data">💾 Export</button>
                <button class="kg-action-btn" onclick="toggleFullscreen()" title="Exit fullscreen">✕ Exit</button>
            `;
            document.body.appendChild(controls);
        } else {
            document.getElementById('fullscreenControls').classList.add('visible');
        }
        
        // Try native fullscreen API
        if (container.requestFullscreen) {
            container.requestFullscreen().catch(err => {
                console.log('Fullscreen API not available, using CSS fallback');
            });
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
        
        // Update button text
        document.querySelectorAll('.fullscreen-btn').forEach(btn => {
            btn.innerHTML = '✕ Exit';
        });
        
    } else {
        // Exit fullscreen
        container.classList.remove('fullscreen');
        
        // Hide exit button and controls
        const exitBtn = document.getElementById('fullscreenExitBtn');
        const controls = document.getElementById('fullscreenControls');
        if (exitBtn) exitBtn.classList.remove('visible');
        if (controls) controls.classList.remove('visible');
        
        // Exit native fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // Update button text
        document.querySelectorAll('.fullscreen-btn').forEach(btn => {
            btn.innerHTML = '⛶ Fullscreen';
        });
    }
    
    // Refit graph after transition
    setTimeout(() => {
        if (kgNetwork) {
            kgNetwork.redraw();
            kgNetwork.fit({ animation: true });
        }
    }, 300);
}

// Listen for ESC key to exit fullscreen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
    }
});

// Listen for native fullscreen change
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isFullscreen) {
        // User exited fullscreen via browser controls
        isFullscreen = false;
        const container = document.getElementById('kgMainContainer');
        if (container) container.classList.remove('fullscreen');
        
        const exitBtn = document.getElementById('fullscreenExitBtn');
        const controls = document.getElementById('fullscreenControls');
        if (exitBtn) exitBtn.classList.remove('visible');
        if (controls) controls.classList.remove('visible');
        
        document.querySelectorAll('.fullscreen-btn').forEach(btn => {
            btn.innerHTML = '⛶ Fullscreen';
        });
    }
});

function highlightPath(pathType) {
    if (!kgNetwork || isCustomMode) return;
    
    // Define paths to highlight
    const paths = {
        temporal: [9, 5, 6], // Tool Wear and sensors
        causal: [9, 14, 15, 16], // Wear to failures
        capacity: [5, 23], // Temperature and capacity constraint
        physical: [8, 24] // Current sensor and physical constraint
    };
    
    const nodesToHighlight = paths[pathType] || [];
    
    // Reset all nodes
    kgNodes.forEach(node => {
        kgNodes.update({ id: node.id, opacity: nodesToHighlight.length ? 0.3 : 1 });
    });
    
    // Highlight selected path
    nodesToHighlight.forEach(id => {
        kgNodes.update({ id: id, opacity: 1 });
    });
    
    // Focus on highlighted nodes
    if (nodesToHighlight.length) {
        kgNetwork.focus(nodesToHighlight[0], { scale: 1.2, animation: true });
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
        kgNodes.forEach(node => {
            kgNodes.update({ id: node.id, opacity: 1 });
        });
    }, 3000);
}

// Initialize KG when scene 6 becomes active (data-scene="7" is at index 6)
const originalAnimateScene = animateScene;
animateScene = function(sceneIndex) {
    originalAnimateScene(sceneIndex);
    // Initialize knowledge graph for scene 6 (index 6 = data-scene 7)
    if (sceneIndex === 6) {
        // Try multiple times in case vis.js hasn't loaded yet
        const tryInit = (attempts) => {
            if (attempts <= 0) return;
            if (typeof vis !== 'undefined') {
                if (!kgNetwork) {
                    console.log('Initializing Knowledge Graph...');
                    initKnowledgeGraph();
                } else {
                    // Network exists, just fit it
                    kgNetwork.fit();
                }
            } else {
                console.log('vis.js not loaded yet, retrying...');
                setTimeout(() => tryInit(attempts - 1), 500);
            }
        };
        setTimeout(() => tryInit(5), 300);
    }
};

// Export functions
window.startPresentation = startPresentation;
window.nextScene = nextScene;
window.prevScene = prevScene;
window.goToScene = goToScene;
window.togglePause = togglePause;
window.toggleNarration = toggleNarration;
window.updateSpeechRate = updateSpeechRate;
window.selectVoice = selectVoice;
window.resyncNarration = resyncNarration;
window.showDefaultGraph = showDefaultGraph;
window.showCustomGraph = showCustomGraph;
window.addCustomNode = addCustomNode;
window.addCustomEdge = addCustomEdge;
window.clearCustomGraph = clearCustomGraph;
window.loadSampleCustom = loadSampleCustom;
window.fitGraph = fitGraph;
window.initKnowledgeGraph = initKnowledgeGraph;
window.togglePhysics = togglePhysics;
window.exportGraph = exportGraph;
window.highlightPath = highlightPath;
window.toggleFullscreen = toggleFullscreen;

// ============================================
// TECHNICAL IMPLEMENTATION TABS
// ============================================
function showImplTab(tabName) {
    // Hide all content
    document.querySelectorAll('.impl-content').forEach(c => {
        c.classList.remove('active');
    });
    
    // Deactivate all tabs
    document.querySelectorAll('.impl-tab').forEach(t => {
        t.classList.remove('active');
    });
    
    // Show selected content
    const content = document.getElementById('impl-' + tabName);
    if (content) content.classList.add('active');
    
    // Activate selected tab
    const tabs = document.querySelectorAll('.impl-tab');
    const tabMap = { 'simulation': 0, 'data': 1, 'kg': 2, 'stack': 3 };
    if (tabs[tabMap[tabName]]) {
        tabs[tabMap[tabName]].classList.add('active');
    }
}

window.showImplTab = showImplTab;

// ============================================
// FAQ CATEGORY SWITCHING
// ============================================
function switchFaqCategory(category) {
    // Update tabs
    document.querySelectorAll('.faq-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.cat === category);
    });
    
    // Update content
    document.querySelectorAll('.faq-category').forEach(cat => {
        cat.classList.remove('active');
    });
    
    const targetCat = document.getElementById('faq-' + category);
    if (targetCat) {
        targetCat.classList.add('active');
    }
}

window.switchFaqCategory = switchFaqCategory;

// ============================================
// SEMANTIC & CONSTRAINT EXAMPLE CAROUSELS
// ============================================
let currentSemanticExample = 1;
let currentConstraintExample = 1;
const totalSemanticExamples = 3;
const totalConstraintExamples = 4;
let semanticAutoPlay = null;
let constraintAutoPlay = null;

function goToSemanticExample(num) {
    currentSemanticExample = num;
    updateSemanticCarousel();
}

function nextSemanticExample() {
    currentSemanticExample = currentSemanticExample >= totalSemanticExamples ? 1 : currentSemanticExample + 1;
    updateSemanticCarousel();
}

function prevSemanticExample() {
    currentSemanticExample = currentSemanticExample <= 1 ? totalSemanticExamples : currentSemanticExample - 1;
    updateSemanticCarousel();
}

function updateSemanticCarousel() {
    const carousel = document.getElementById('semanticCarousel');
    if (!carousel) return;
    
    // Update examples
    carousel.querySelectorAll('.flyio-example').forEach(ex => {
        ex.classList.remove('active');
        if (parseInt(ex.dataset.example) === currentSemanticExample) {
            ex.classList.add('active');
            // Reset and replay animations
            ex.querySelectorAll('.fly-left, .fly-right, .fly-up, .fly-down').forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; // Trigger reflow
                el.style.animation = '';
            });
        }
    });
    
    // Update dots
    const dots = document.getElementById('semanticDots');
    if (dots) {
        dots.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i + 1 === currentSemanticExample);
        });
    }
}

function goToConstraintExample(num) {
    currentConstraintExample = num;
    updateConstraintCarousel();
}

function nextConstraintExample() {
    currentConstraintExample = currentConstraintExample >= totalConstraintExamples ? 1 : currentConstraintExample + 1;
    updateConstraintCarousel();
}

function prevConstraintExample() {
    currentConstraintExample = currentConstraintExample <= 1 ? totalConstraintExamples : currentConstraintExample - 1;
    updateConstraintCarousel();
}

function updateConstraintCarousel() {
    const carousel = document.getElementById('constraintCarousel');
    if (!carousel) return;
    
    // Update examples
    carousel.querySelectorAll('.flyio-example').forEach(ex => {
        ex.classList.remove('active');
        if (parseInt(ex.dataset.example) === currentConstraintExample) {
            ex.classList.add('active');
            // Reset and replay animations
            ex.querySelectorAll('.fly-left, .fly-right, .fly-up, .fly-down').forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; // Trigger reflow
                el.style.animation = '';
            });
        }
    });
    
    // Update dots
    const dots = document.getElementById('constraintDots');
    if (dots) {
        dots.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i + 1 === currentConstraintExample);
        });
    }
}

// Auto-play carousels when on Scene 1
function startExampleAutoPlay() {
    // Clear any existing intervals
    stopExampleAutoPlay();
    
    // Auto-advance every 5 seconds
    semanticAutoPlay = setInterval(nextSemanticExample, 5000);
    constraintAutoPlay = setInterval(nextConstraintExample, 6000); // Slightly offset
}

function stopExampleAutoPlay() {
    if (semanticAutoPlay) {
        clearInterval(semanticAutoPlay);
        semanticAutoPlay = null;
    }
    if (constraintAutoPlay) {
        clearInterval(constraintAutoPlay);
        constraintAutoPlay = null;
    }
}

// Initialize when scene 1 loads
function initExampleCarousels() {
    currentSemanticExample = 1;
    currentConstraintExample = 1;
    updateSemanticCarousel();
    updateConstraintCarousel();
    startExampleAutoPlay();
}

// Expose functions globally
window.goToSemanticExample = goToSemanticExample;
window.nextSemanticExample = nextSemanticExample;
window.prevSemanticExample = prevSemanticExample;
window.goToConstraintExample = goToConstraintExample;
window.nextConstraintExample = nextConstraintExample;
window.prevConstraintExample = prevConstraintExample;

// ============================================
// ARCHITECTURE VISUALIZATION SYSTEM
// ============================================
let currentArchView = 'pipeline';
let archAnimationRunning = false;
let archFullscreen = false;

function switchArchView(view) {
    if (view === currentArchView) return;
    
    // Update tabs
    document.querySelectorAll('.arch-viz-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view);
    });
    
    // Switch views
    document.querySelectorAll('.arch-view').forEach(v => {
        v.classList.remove('active');
    });
    
    const targetView = document.getElementById(view + 'View');
    if (targetView) {
        targetView.classList.add('active');
        currentArchView = view;
        
        // Trigger animations for the new view
        setTimeout(() => replayArchAnimation(), 100);
    }
}

function replayArchAnimation() {
    if (archAnimationRunning) return;
    archAnimationRunning = true;
    
    if (currentArchView === 'pipeline') {
        replayPipelineAnimation();
    } else {
        replayGridAnimation();
    }
    
    setTimeout(() => {
        archAnimationRunning = false;
    }, 3000);
}

function replayPipelineAnimation() {
    // Reset pipeline stages
    const stages = document.querySelectorAll('.pipeline-stage, .pipeline-output');
    stages.forEach(stage => {
        stage.style.animation = 'none';
        stage.offsetHeight; // Trigger reflow
        stage.style.animation = '';
    });
    
    // Reset detail items
    const details = document.querySelectorAll('.detail-item');
    details.forEach(item => {
        item.style.animation = 'none';
        item.offsetHeight;
        item.style.animation = '';
    });
    
    // Reset flow line
    const flowLine = document.querySelector('.pipeline-flow-line');
    if (flowLine) {
        flowLine.style.animation = 'none';
        flowLine.offsetHeight;
        flowLine.style.animation = '';
    }
    
    // Reset particles
    const particles = document.querySelectorAll('.flow-particle');
    particles.forEach(p => {
        p.style.animation = 'none';
        p.offsetHeight;
        p.style.animation = '';
    });
    
    // Reset eval bar
    const evalBar = document.querySelector('.pipeline-eval-bar');
    if (evalBar) {
        evalBar.style.animation = 'none';
        evalBar.offsetHeight;
        evalBar.style.animation = '';
    }
    
    const evalItems = document.querySelectorAll('.eval-item');
    evalItems.forEach(item => {
        item.style.animation = 'none';
        item.offsetHeight;
        item.style.animation = '';
    });
}

function replayGridAnimation() {
    // Reset grid cards
    const cards = document.querySelectorAll('.grid-card');
    cards.forEach(card => {
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = '';
    });
    
    // Reset flow arrows
    const arrows = document.querySelectorAll('.flow-arrow');
    arrows.forEach(arrow => {
        arrow.style.animation = 'none';
        arrow.offsetHeight;
        arrow.style.animation = '';
    });
    
    // Reset output card
    const outputCard = document.querySelector('.grid-output-card');
    if (outputCard) {
        outputCard.style.animation = 'none';
        outputCard.offsetHeight;
        outputCard.style.animation = '';
    }
}

function toggleGridCard(btn) {
    const card = btn.closest('.grid-card');
    if (card) {
        card.classList.toggle('expanded');
        btn.classList.toggle('expanded');
    }
}

function toggleArchFullscreen() {
    const container = document.querySelector('.arch-viz-container');
    const btn = document.getElementById('archFullscreenBtn');
    
    archFullscreen = !archFullscreen;
    
    if (archFullscreen) {
        container.classList.add('fullscreen');
        btn.innerHTML = '<span>✕</span> Exit';
        
        // Create exit button
        let exitBtn = document.querySelector('.arch-fullscreen-exit');
        if (!exitBtn) {
            exitBtn = document.createElement('button');
            exitBtn.className = 'arch-fullscreen-exit';
            exitBtn.innerHTML = '✕ Exit Fullscreen';
            exitBtn.onclick = toggleArchFullscreen;
            container.appendChild(exitBtn);
        }
        exitBtn.style.display = 'block';
        
        // Try native fullscreen
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    } else {
        container.classList.remove('fullscreen');
        btn.innerHTML = '<span>⛶</span> Fullscreen';
        
        const exitBtn = document.querySelector('.arch-fullscreen-exit');
        if (exitBtn) exitBtn.style.display = 'none';
        
        // Exit native fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function exportArchDiagram() {
    const content = document.getElementById('archVizContent');
    if (!content) return;
    
    // Use html2canvas if available, otherwise provide instructions
    if (typeof html2canvas !== 'undefined') {
        html2canvas(content, {
            backgroundColor: '#0f0f1a',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'scfa-architecture-' + currentArchView + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    } else {
        // Fallback: create a simple export notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.95);
            color: white;
            padding: 30px 40px;
            border-radius: 15px;
            z-index: 10002;
            text-align: center;
            max-width: 400px;
        `;
        notification.innerHTML = `
            <h3 style="margin-bottom: 15px;">📥 Export Options</h3>
            <p style="margin-bottom: 15px; color: #aaa;">To capture this diagram:</p>
            <ol style="text-align: left; color: #ccc; font-size: 0.9rem; line-height: 1.8;">
                <li>Press <strong>⛶ Fullscreen</strong> for best quality</li>
                <li>Use <strong>Cmd/Ctrl + Shift + 4</strong> (Mac) or <strong>Windows + Shift + S</strong> (PC)</li>
                <li>Select the diagram area</li>
            </ol>
            <button onclick="this.parentElement.remove()" style="
                margin-top: 20px;
                padding: 10px 25px;
                background: var(--purple, #9c27b0);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
            ">Got it!</button>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }
}

// Initialize architecture viz when scene 19 loads
function initArchViz() {
    // Set default view
    switchArchView('pipeline');
}

// Listen for ESC key to exit fullscreen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && archFullscreen) {
        toggleArchFullscreen();
    }
});

// Listen for native fullscreen change
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && archFullscreen) {
        const container = document.querySelector('.arch-viz-container');
        const btn = document.getElementById('archFullscreenBtn');
        
        archFullscreen = false;
        if (container) container.classList.remove('fullscreen');
        if (btn) btn.innerHTML = '<span>⛶</span> Fullscreen';
        
        const exitBtn = document.querySelector('.arch-fullscreen-exit');
        if (exitBtn) exitBtn.style.display = 'none';
    }
});

// Export functions
window.switchArchView = switchArchView;
window.replayArchAnimation = replayArchAnimation;
window.toggleGridCard = toggleGridCard;
window.toggleArchFullscreen = toggleArchFullscreen;
window.exportArchDiagram = exportArchDiagram;
window.initArchViz = initArchViz;

// ============================================
// HANDWRITTEN NOTES SYSTEM
// Real-time sketchy notes & flowcharts
// ============================================

// Store all notes to persist across navigation
let persistedNotes = {};
let persistedFlowcharts = {};
let currentInsightView = 'flow';
let roughCanvas = null;
let flowRoughCanvas = null;
let noteTimers = [];
let flowTimers = [];

// Scene-specific notes data with timing - COMPREHENSIVE for all 29 scenes
const sceneNotesData = {
    0: { // Title
        notes: [
            { type: 'keyword', text: 'SCFA = Semantic-Constrained Federated Aggregation', delay: 1000 },
            { type: 'insight', text: 'Novel approach to FL in manufacturing!', delay: 3000 },
            { type: 'stat', text: '22% faster convergence', delay: 5000 },
            { type: 'stat', text: '2.7× better privacy-utility tradeoff', delay: 7000 }
        ],
        flow: [
            { id: 'f1', text: 'Federated Learning', type: 'concept', x: 30, y: 30, delay: 2000 },
            { id: 'f2', text: '+ Semantics', type: 'process', x: 30, y: 100, delay: 3500 },
            { id: 'f3', text: '+ Constraints', type: 'process', x: 30, y: 170, delay: 4500 },
            { id: 'f4', text: '= SCFA', type: 'result', x: 30, y: 240, delay: 6000 }
        ],
        stats: [
            { value: '22%', label: 'Faster Convergence', type: 'highlight' },
            { value: '2.7×', label: 'Privacy-Utility Improvement', type: 'highlight' },
            { value: '18%', label: 'Critical Threshold', type: 'info' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    1: { // What is SCFA?
        notes: [
            { type: 'keyword', text: 'Semantic = Same meaning across systems', delay: 2000 },
            { type: 'method', text: 'Feature alignment across factories', delay: 4000 },
            { type: 'keyword', text: 'Constrained = Physical laws must hold', delay: 6000 },
            { type: 'important', text: '⚠️ Tool wear can ONLY increase!', delay: 8000 },
            { type: 'formula', text: '∂(wear)/∂t ≥ 0', delay: 10000 },
            { type: 'insight', text: 'Physics guides machine learning', delay: 12000 }
        ],
        flow: [
            { id: 's1', text: '🏭 Factory A', type: 'concept', x: 20, y: 20, delay: 1500 },
            { id: 's2', text: '🏭 Factory B', type: 'concept', x: 140, y: 20, delay: 2000 },
            { id: 's3', text: 'Different encodings', type: 'warning', x: 80, y: 90, delay: 4000 },
            { id: 's4', text: 'Semantic Alignment', type: 'process', x: 80, y: 160, delay: 6000 },
            { id: 's5', text: 'Unified Model', type: 'result', x: 80, y: 230, delay: 8000 }
        ],
        stats: [
            { value: '4', label: 'Constraint Types', type: 'info' },
            { value: '3,000', label: 'Rules Derived', type: 'highlight' },
            { value: '5,247', label: 'Entities Extracted', type: 'info' }
        ],
        connections: [[0,2], [1,2], [2,3], [3,4]]
    },
    2: { // Terminology
        notes: [
            { type: 'keyword', text: 'Federated Learning = Distributed ML', delay: 1500 },
            { type: 'keyword', text: 'Knowledge Graph = Semantic relationships', delay: 3500 },
            { type: 'keyword', text: 'Ontology = Formal domain vocabulary', delay: 5500 },
            { type: 'keyword', text: 'Non-IID = Different data distributions', delay: 7500 },
            { type: 'method', text: 'SPARQL = Query language for KGs', delay: 9500 }
        ],
        flow: [
            { id: 't1', text: 'FL', type: 'concept', x: 30, y: 30, delay: 1000 },
            { id: 't2', text: 'KG', type: 'concept', x: 130, y: 30, delay: 2500 },
            { id: 't3', text: 'Ontology', type: 'concept', x: 30, y: 110, delay: 4500 },
            { id: 't4', text: 'Non-IID', type: 'warning', x: 130, y: 110, delay: 6500 },
            { id: 't5', text: 'SCFA', type: 'result', x: 80, y: 190, delay: 8500 }
        ],
        stats: [
            { value: '5', label: 'Key Concepts', type: 'info' },
            { value: '4', label: 'Heterogeneity Types', type: 'warning' }
        ],
        connections: [[0,4], [1,4], [2,4], [3,4]]
    },
    3: { // Architecture Overview
        notes: [
            { type: 'method', text: 'Step 1: Knowledge Graph Construction', delay: 2000 },
            { type: 'method', text: 'Step 2: Constraint Extraction (SPARQL)', delay: 4000 },
            { type: 'method', text: 'Step 3: Local Model Training', delay: 6000 },
            { type: 'method', text: 'Step 4: Constraint Validation', delay: 8000 },
            { type: 'method', text: 'Step 5: Weighted Aggregation', delay: 10000 },
            { type: 'insight', text: 'End-to-end semantic integration!', delay: 12000 }
        ],
        flow: [
            { id: 'a1', text: 'Knowledge Graph', type: 'concept', x: 80, y: 20, delay: 1500 },
            { id: 'a2', text: 'Extract Rules', type: 'process', x: 80, y: 80, delay: 3500 },
            { id: 'a3', text: 'Local Training', type: 'process', x: 80, y: 140, delay: 5500 },
            { id: 'a4', text: 'Validate', type: 'process', x: 80, y: 200, delay: 7500 },
            { id: 'a5', text: 'Aggregate', type: 'result', x: 80, y: 260, delay: 9500 }
        ],
        stats: [
            { value: '5', label: 'Pipeline Steps', type: 'info' },
            { value: '0.29%', label: 'Compute Overhead', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3], [3,4]]
    },
    4: { // Story Begins
        notes: [
            { type: 'keyword', text: 'Bosch = Global manufacturing leader', delay: 2000 },
            { type: 'stat', text: '5 facilities across 3 continents', delay: 4000 },
            { type: 'important', text: 'Tool wear = Critical for quality!', delay: 6000 },
            { type: 'insight', text: 'Predict failures before they happen', delay: 8000 }
        ],
        flow: [
            { id: 'b1', text: '🏭 Bosch', type: 'concept', x: 80, y: 30, delay: 1500 },
            { id: 'b2', text: '5 Facilities', type: 'process', x: 80, y: 100, delay: 3500 },
            { id: 'b3', text: 'Tool Wear', type: 'warning', x: 80, y: 170, delay: 5500 },
            { id: 'b4', text: 'Prediction', type: 'result', x: 80, y: 240, delay: 7500 }
        ],
        stats: [
            { value: '5', label: 'Manufacturing Facilities', type: 'info' },
            { value: '3', label: 'Continents', type: 'info' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    5: { // The Problem
        notes: [
            { type: 'important', text: 'Problem: Data CANNOT leave facilities!', delay: 1500 },
            { type: 'keyword', text: 'Privacy regulations (GDPR, CCPA)', delay: 3000 },
            { type: 'keyword', text: 'Competitive secrets', delay: 4500 },
            { type: 'stat', text: '5 facilities, isolated data silos', delay: 6000 },
            { type: 'insight', text: 'FL allows learning without sharing raw data', delay: 8000 },
            { type: 'important', text: 'But standard FL ignores domain knowledge!', delay: 10000 }
        ],
        flow: [
            { id: 'p1', text: '🏭 Plant 1', type: 'concept', x: 20, y: 30, delay: 2000 },
            { id: 'p2', text: '🏭 Plant 2', type: 'concept', x: 140, y: 30, delay: 2500 },
            { id: 'p3', text: '🔒 Data Silos', type: 'warning', x: 80, y: 100, delay: 4000 },
            { id: 'p4', text: 'Privacy Laws', type: 'warning', x: 80, y: 170, delay: 5500 },
            { id: 'p5', text: 'Need FL!', type: 'result', x: 80, y: 240, delay: 7000 }
        ],
        stats: [
            { value: '100%', label: 'Data Stays Local', type: 'highlight' },
            { value: 'GDPR', label: 'Compliance Required', type: 'warning' }
        ],
        connections: [[0,2], [1,2], [2,3], [3,4]]
    },
    6: { // Our Insight
        notes: [
            { type: 'insight', text: 'Key insight: Physics doesnt change!', delay: 2000 },
            { type: 'keyword', text: 'Tool wear always increases (monotonic)', delay: 4000 },
            { type: 'keyword', text: 'Temperature affects cutting speed', delay: 6000 },
            { type: 'method', text: 'Encode physics as constraints', delay: 8000 },
            { type: 'important', text: 'Reject updates violating physics!', delay: 10000 }
        ],
        flow: [
            { id: 'i1', text: 'Physics Laws', type: 'concept', x: 80, y: 30, delay: 1500 },
            { id: 'i2', text: 'Same Everywhere', type: 'result', x: 80, y: 100, delay: 3500 },
            { id: 'i3', text: 'Encode as Rules', type: 'process', x: 80, y: 170, delay: 5500 },
            { id: 'i4', text: 'Validate Updates', type: 'process', x: 80, y: 240, delay: 7500 }
        ],
        stats: [
            { value: '892', label: 'Temporal Constraints', type: 'info' },
            { value: '756', label: 'Causal Constraints', type: 'info' },
            { value: '634', label: 'Capacity Constraints', type: 'info' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    7: { // Knowledge Graph Interactive
        notes: [
            { type: 'keyword', text: 'Knowledge Graph = Structured relationships', delay: 2000 },
            { type: 'method', text: 'Nodes = Entities (machines, sensors)', delay: 4000 },
            { type: 'method', text: 'Edges = Relationships (affects, causes)', delay: 6000 },
            { type: 'stat', text: '5,247 entities extracted', delay: 8000 },
            { type: 'stat', text: '12,893 relationships mapped', delay: 10000 },
            { type: 'insight', text: 'Click nodes to explore!', delay: 12000 }
        ],
        flow: [
            { id: 'g1', text: 'Ontologies', type: 'concept', x: 80, y: 20, delay: 1500 },
            { id: 'g2', text: 'ISA-95', type: 'process', x: 30, y: 90, delay: 3000 },
            { id: 'g3', text: 'MASON', type: 'process', x: 130, y: 90, delay: 4000 },
            { id: 'g4', text: 'Knowledge Graph', type: 'result', x: 80, y: 170, delay: 6000 },
            { id: 'g5', text: '3,000 Rules', type: 'result', x: 80, y: 240, delay: 8000 }
        ],
        stats: [
            { value: '5,247', label: 'Entities', type: 'highlight' },
            { value: '12,893', label: 'Relationships', type: 'highlight' },
            { value: '847', label: 'Cross-Ontology Alignments', type: 'info' }
        ],
        connections: [[0,1], [0,2], [1,3], [2,3], [3,4]]
    },
    8: { // KG Construction
        notes: [
            { type: 'method', text: 'Phase 1: Ontology Acquisition', delay: 2000 },
            { type: 'stat', text: 'ISA-95: 2,341 classes', delay: 4000 },
            { type: 'stat', text: 'MASON: 1,287 classes', delay: 5500 },
            { type: 'stat', text: 'NIST AM: 891 classes', delay: 7000 },
            { type: 'method', text: 'Phase 2: Entity Extraction', delay: 9000 },
            { type: 'stat', text: '5,247 entities extracted', delay: 11000 },
            { type: 'method', text: 'Phase 3: Constraint Derivation', delay: 13000 },
            { type: 'formula', text: 'SPARQL queries → 3,000 rules', delay: 15000 },
            { type: 'insight', text: 'Constraints DERIVED, not manually specified!', delay: 17000 }
        ],
        flow: [
            { id: 'k1', text: 'Ontologies', type: 'concept', x: 80, y: 20, delay: 1500 },
            { id: 'k2', text: 'rdflib + owlready2', type: 'process', x: 80, y: 80, delay: 3500 },
            { id: 'k3', text: '5,247 Entities', type: 'result', x: 30, y: 150, delay: 6000 },
            { id: 'k4', text: '12,893 Relations', type: 'result', x: 130, y: 150, delay: 7000 },
            { id: 'k5', text: 'SPARQL', type: 'process', x: 80, y: 220, delay: 10000 },
            { id: 'k6', text: '3,000 Constraints', type: 'result', x: 80, y: 290, delay: 12000 }
        ],
        stats: [
            { value: '4', label: 'Ontology Sources', type: 'info' },
            { value: '5,247', label: 'Classes Total', type: 'highlight' },
            { value: '3,000', label: 'Constraints Derived', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [1,3], [2,4], [3,4], [4,5]]
    },
    9: { // Constraint Validation
        notes: [
            { type: 'method', text: 'Step 1: Generate predictions ŷₖ', delay: 2000 },
            { type: 'method', text: 'Step 2: Check each constraint', delay: 4000 },
            { type: 'formula', text: 'vᵢ = 𝟙[constraint satisfied]', delay: 6000 },
            { type: 'method', text: 'Step 3: Compute validity score', delay: 8000 },
            { type: 'formula', text: 'sₖ = (1/|C|) Σᵢ vᵢ', delay: 10000 },
            { type: 'important', text: '⚠️ NO high/low categorization!', delay: 12000 },
            { type: 'insight', text: 'Equal weighting → No human bias', delay: 14000 },
            { type: 'method', text: 'Continuous score, not binary', delay: 16000 }
        ],
        flow: [
            { id: 'v1', text: 'Δwₖ update', type: 'concept', x: 80, y: 20, delay: 1000 },
            { id: 'v2', text: 'Apply to model', type: 'process', x: 80, y: 80, delay: 3000 },
            { id: 'v3', text: 'Check constraints', type: 'process', x: 80, y: 140, delay: 5000 },
            { id: 'v4', text: 'sₖ ∈ [0,1]', type: 'result', x: 80, y: 200, delay: 9000 },
            { id: 'v5', text: 'Weight αₖ', type: 'result', x: 80, y: 260, delay: 11000 }
        ],
        stats: [
            { value: '4', label: 'Constraint Types', type: 'info' },
            { value: '[0,1]', label: 'Continuous Score Range', type: 'highlight' },
            { value: '0', label: 'Manual Categorization', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3], [3,4]]
    },
    10: { // Convergence Impact
        notes: [
            { type: 'formula', text: 'E[‖wᵗ - w*‖²] convergence bound', delay: 2000 },
            { type: 'keyword', text: '(1-ρ) = variance reduction factor!', delay: 4000 },
            { type: 'stat', text: 'FedAvg: 41 rounds to converge', delay: 6000 },
            { type: 'stat', text: 'SCFA: 32 rounds to converge ✓', delay: 8000 },
            { type: 'stat', text: '22% faster convergence!', delay: 10000 },
            { type: 'important', text: 'Critical threshold: ρ = 18%', delay: 12000 },
            { type: 'insight', text: 'Below 18% → Constraints accelerate', delay: 14000 },
            { type: 'stat', text: 'R² = 0.93 validation', delay: 16000 }
        ],
        flow: [
            { id: 'c1', text: 'Constraints', type: 'concept', x: 80, y: 20, delay: 1500 },
            { id: 'c2', text: 'Reduce space', type: 'process', x: 80, y: 80, delay: 3500 },
            { id: 'c3', text: 'Lower variance', type: 'process', x: 80, y: 140, delay: 5500 },
            { id: 'c4', text: 'Faster convergence', type: 'result', x: 80, y: 200, delay: 7500 },
            { id: 'c5', text: '22% improvement', type: 'result', x: 80, y: 260, delay: 9500 }
        ],
        stats: [
            { value: '22%', label: 'Faster Convergence', type: 'highlight' },
            { value: '18%', label: 'Critical Threshold (ρ)', type: 'warning' },
            { value: '0.93', label: 'R² Validation', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3], [3,4]]
    },
    11: { // Data Heterogeneity
        notes: [
            { type: 'keyword', text: 'Non-IID = Different data distributions', delay: 2000 },
            { type: 'formula', text: 'Pₖ(X,Y) ≠ Pⱼ(X,Y)', delay: 4000 },
            { type: 'method', text: 'Type 1: Feature skew (voltage 230V vs 120V)', delay: 6000 },
            { type: 'method', text: 'Type 2: Label skew (5% vs 40% failures)', delay: 8000 },
            { type: 'method', text: 'Type 3: Concept drift (same input, different meaning)', delay: 10000 },
            { type: 'method', text: 'Type 4: Quantity skew (450K vs 35K samples)', delay: 12000 },
            { type: 'formula', text: 'Dirichlet α ∈ {0.1, 0.5, 1.0, 5.0, 10.0}', delay: 14000 },
            { type: 'insight', text: 'α → 0 = extreme heterogeneity', delay: 16000 }
        ],
        flow: [
            { id: 'h1', text: 'IID Data', type: 'concept', x: 30, y: 30, delay: 1500 },
            { id: 'h2', text: 'α → ∞', type: 'result', x: 140, y: 30, delay: 2500 },
            { id: 'h3', text: 'Non-IID', type: 'warning', x: 30, y: 120, delay: 5000 },
            { id: 'h4', text: 'α → 0', type: 'warning', x: 140, y: 120, delay: 6000 },
            { id: 'h5', text: '4 Types', type: 'process', x: 80, y: 200, delay: 9000 }
        ],
        stats: [
            { value: '4', label: 'Heterogeneity Types', type: 'info' },
            { value: '0.1-10', label: 'Dirichlet α Range Tested', type: 'info' },
            { value: '5', label: 'α Values in Experiments', type: 'highlight' }
        ],
        connections: [[0,1], [2,3], [2,4], [3,4]]
    },
    12: { // Heterogeneity Impact
        notes: [
            { type: 'important', text: 'Local optimal ≠ Globally valid!', delay: 2000 },
            { type: 'keyword', text: 'Heterogeneity causes constraint violations', delay: 4000 },
            { type: 'stat', text: 'FedAvg @ α=0.1: 38.4% violations', delay: 6000 },
            { type: 'stat', text: 'SCFA @ α=0.1: 14.7% violations', delay: 8000 },
            { type: 'stat', text: '62% reduction in violations!', delay: 10000 },
            { type: 'method', text: 'Mechanism 1: Semantic alignment layer', delay: 12000 },
            { type: 'method', text: 'Mechanism 2: Validity-weighted aggregation', delay: 14000 },
            { type: 'method', text: 'Mechanism 3: Domain-invariant constraints', delay: 16000 }
        ],
        flow: [
            { id: 'i1', text: 'Heterogeneity', type: 'warning', x: 80, y: 20, delay: 1500 },
            { id: 'i2', text: 'FedAvg: 38%', type: 'warning', x: 30, y: 90, delay: 4000 },
            { id: 'i3', text: 'SCFA: 15%', type: 'result', x: 130, y: 90, delay: 6000 },
            { id: 'i4', text: '3 Mechanisms', type: 'process', x: 80, y: 160, delay: 10000 },
            { id: 'i5', text: '62% better!', type: 'result', x: 80, y: 230, delay: 12000 }
        ],
        stats: [
            { value: '38.4%', label: 'FedAvg Violations @ α=0.1', type: 'warning' },
            { value: '14.7%', label: 'SCFA Violations @ α=0.1', type: 'highlight' },
            { value: '62%', label: 'Violation Reduction', type: 'highlight' }
        ],
        connections: [[0,1], [0,2], [1,3], [2,3], [3,4]]
    },
    13: { // SCFA Algorithm
        notes: [
            { type: 'method', text: 'Step 1: Local training (E epochs)', delay: 2000 },
            { type: 'formula', text: 'wₖ = wₖ - η∇L(wₖ; Dₖ)', delay: 4000 },
            { type: 'method', text: 'Step 2: Constraint validation on server', delay: 6000 },
            { type: 'formula', text: 'sₖ = validity score ∈ [0,1]', delay: 8000 },
            { type: 'method', text: 'Step 3: Weighted aggregation', delay: 10000 },
            { type: 'formula', text: 'αₖ = (nₖ·sₖ) / Σⱼ(nⱼ·sⱼ)', delay: 12000 },
            { type: 'insight', text: 'Violators get down-weighted automatically!', delay: 14000 }
        ],
        flow: [
            { id: 'a1', text: 'Local Train', type: 'concept', x: 80, y: 20, delay: 1500 },
            { id: 'a2', text: 'Send Δwₖ', type: 'process', x: 80, y: 80, delay: 4000 },
            { id: 'a3', text: 'Validate', type: 'process', x: 80, y: 140, delay: 7000 },
            { id: 'a4', text: 'Weight αₖ', type: 'process', x: 80, y: 200, delay: 10000 },
            { id: 'a5', text: 'Aggregate', type: 'result', x: 80, y: 260, delay: 12000 }
        ],
        stats: [
            { value: '3', label: 'Main Steps', type: 'info' },
            { value: 'O(|C|)', label: 'Validation Complexity', type: 'info' },
            { value: '0.29%', label: 'Compute Overhead', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3], [3,4]]
    },
    14: { // Research Questions
        notes: [
            { type: 'keyword', text: 'RQ1: Convergence & Accuracy impact?', delay: 2000 },
            { type: 'keyword', text: 'RQ2: Privacy-utility tradeoff?', delay: 4000 },
            { type: 'keyword', text: 'RQ3: Constraint violation threshold?', delay: 6000 },
            { type: 'insight', text: 'Three complementary perspectives', delay: 8000 },
            { type: 'method', text: 'Validated on 3 real datasets', delay: 10000 }
        ],
        flow: [
            { id: 'r1', text: 'RQ1', type: 'concept', x: 30, y: 50, delay: 1500 },
            { id: 'r2', text: 'RQ2', type: 'concept', x: 130, y: 50, delay: 3500 },
            { id: 'r3', text: 'RQ3', type: 'concept', x: 80, y: 120, delay: 5500 },
            { id: 'r4', text: 'SCFA', type: 'result', x: 80, y: 200, delay: 7500 }
        ],
        stats: [
            { value: '3', label: 'Research Questions', type: 'info' },
            { value: '3', label: 'Datasets Used', type: 'info' },
            { value: '2', label: 'Theorems Validated', type: 'highlight' }
        ],
        connections: [[0,3], [1,3], [2,3]]
    },
    15: { // RQ1 Architecture
        notes: [
            { type: 'keyword', text: 'RQ1: How do constraints affect convergence?', delay: 2000 },
            { type: 'method', text: 'Hypothesis space reduction', delay: 4000 },
            { type: 'method', text: 'Gradient variance reduction', delay: 6000 },
            { type: 'formula', text: 'Constrained space ⊂ Full space', delay: 8000 },
            { type: 'insight', text: 'Fewer valid directions = Faster convergence', delay: 10000 }
        ],
        flow: [
            { id: 'q1a', text: 'Full Space', type: 'warning', x: 80, y: 30, delay: 1500 },
            { id: 'q1b', text: 'Apply Constraints', type: 'process', x: 80, y: 100, delay: 3500 },
            { id: 'q1c', text: 'Reduced Space', type: 'result', x: 80, y: 170, delay: 5500 },
            { id: 'q1d', text: 'Faster Learning', type: 'result', x: 80, y: 240, delay: 7500 }
        ],
        stats: [
            { value: '~63%', label: 'Space Reduction', type: 'highlight' },
            { value: 'Lower', label: 'Gradient Variance', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    16: { // RQ1 Theorem
        notes: [
            { type: 'keyword', text: 'Theorem 1: Convergence Rate', delay: 2000 },
            { type: 'formula', text: 'E[‖wᵗ - w*‖²] ≤ (1-μη)ᵗ·‖w⁰-w*‖²', delay: 4000 },
            { type: 'formula', text: '+ (η²σ²/μ)·(1-ρ)', delay: 6000 },
            { type: 'keyword', text: 'ρ = constraint violation rate', delay: 8000 },
            { type: 'insight', text: '(1-ρ) directly reduces variance bound!', delay: 10000 },
            { type: 'stat', text: 'R² = 0.94 empirical validation', delay: 12000 }
        ],
        flow: [
            { id: 't1a', text: 'Theorem 1', type: 'concept', x: 80, y: 30, delay: 1500 },
            { id: 't1b', text: 'Variance term', type: 'process', x: 80, y: 100, delay: 5000 },
            { id: 't1c', text: '× (1-ρ)', type: 'result', x: 80, y: 170, delay: 7000 },
            { id: 't1d', text: 'Reduced!', type: 'result', x: 80, y: 240, delay: 9000 }
        ],
        stats: [
            { value: '(1-ρ)', label: 'Variance Reduction Factor', type: 'highlight' },
            { value: '0.94', label: 'R² Empirical Fit', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    17: { // RQ1 Results
        notes: [
            { type: 'stat', text: 'SCFA RMSE: 0.0198 ± 0.0012', delay: 2000 },
            { type: 'stat', text: 'FedAvg RMSE: 0.0287 ± 0.0023', delay: 4000 },
            { type: 'stat', text: '31% improvement in accuracy!', delay: 6000 },
            { type: 'stat', text: '22% faster convergence (32 vs 41 rounds)', delay: 8000 },
            { type: 'insight', text: 'Theorem 1 validated: R² = 0.94', delay: 10000 },
            { type: 'stat', text: 'Consistent across all 3 datasets', delay: 12000 }
        ],
        flow: [
            { id: 'r1a', text: 'RQ1', type: 'concept', x: 80, y: 30, delay: 1000 },
            { id: 'r1b', text: 'Convergence?', type: 'process', x: 80, y: 100, delay: 3000 },
            { id: 'r1c', text: '22% faster', type: 'result', x: 30, y: 170, delay: 5000 },
            { id: 'r1d', text: '31% better', type: 'result', x: 130, y: 170, delay: 7000 },
            { id: 'r1e', text: 'Validated!', type: 'result', x: 80, y: 240, delay: 9000 }
        ],
        stats: [
            { value: '31%', label: 'Accuracy Improvement', type: 'highlight' },
            { value: '22%', label: 'Faster Convergence', type: 'highlight' },
            { value: '0.94', label: 'R² Validation', type: 'info' }
        ],
        connections: [[0,1], [1,2], [1,3], [2,4], [3,4]]
    },
    18: { // RQ2 Privacy
        notes: [
            { type: 'keyword', text: 'RQ2: Can constraints improve privacy?', delay: 2000 },
            { type: 'method', text: 'Differential Privacy + SCFA', delay: 4000 },
            { type: 'keyword', text: 'Privacy budget ε controls noise', delay: 6000 },
            { type: 'insight', text: 'Constraints reduce gradient sensitivity!', delay: 8000 },
            { type: 'formula', text: 'Less sensitivity → Less noise needed', delay: 10000 }
        ],
        flow: [
            { id: 'p2a', text: 'DP Noise', type: 'warning', x: 80, y: 30, delay: 1500 },
            { id: 'p2b', text: 'Add to gradients', type: 'process', x: 80, y: 100, delay: 3500 },
            { id: 'p2c', text: 'SCFA constraints', type: 'process', x: 80, y: 170, delay: 5500 },
            { id: 'p2d', text: 'Less noise OK!', type: 'result', x: 80, y: 240, delay: 7500 }
        ],
        stats: [
            { value: 'ε', label: 'Privacy Budget', type: 'info' },
            { value: '63%', label: 'Less Noise Needed', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    19: { // RQ2 Theorem
        notes: [
            { type: 'keyword', text: 'Theorem 2: Privacy Amplification', delay: 2000 },
            { type: 'formula', text: 'σ²_SCFA = σ²_DP · (1 - θ)', delay: 4000 },
            { type: 'stat', text: 'θ = 0.37 in experiments', delay: 6000 },
            { type: 'insight', text: '63% noise reduction at same ε!', delay: 8000 },
            { type: 'method', text: 'Constraints bound gradient magnitude', delay: 10000 }
        ],
        flow: [
            { id: 't2a', text: 'Theorem 2', type: 'concept', x: 80, y: 30, delay: 1500 },
            { id: 't2b', text: 'σ² = noise', type: 'process', x: 80, y: 100, delay: 3500 },
            { id: 't2c', text: '× (1-θ)', type: 'result', x: 80, y: 170, delay: 5500 },
            { id: 't2d', text: '63% less!', type: 'result', x: 80, y: 240, delay: 7500 }
        ],
        stats: [
            { value: 'θ=0.37', label: 'Noise Reduction Parameter', type: 'highlight' },
            { value: '63%', label: 'Noise Reduction', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    20: { // Hypothesis Space Reduction Deep Dive
        notes: [
            { type: 'keyword', text: 'Hypothesis Space = All possible model configs', delay: 2000 },
            { type: 'stat', text: 'Full space: 8.7M parameters', delay: 4000 },
            { type: 'method', text: 'Temporal constraints: -28% space', delay: 6000 },
            { type: 'method', text: 'Causal constraints: -18% space', delay: 8000 },
            { type: 'method', text: 'Capacity constraints: -12% space', delay: 10000 },
            { type: 'method', text: 'Physical laws: -5% space', delay: 12000 },
            { type: 'stat', text: 'Total: 63% reduction → 3.2M effective', delay: 14000 },
            { type: 'formula', text: 'H_constrained ⊂ H_full', delay: 16000 },
            { type: 'important', text: 'Key: ρ < 18% threshold required!', delay: 18000 },
            { type: 'insight', text: 'Smaller space = Less noise impact = 2.7× better!', delay: 20000 },
            { type: 'keyword', text: 'Novelty: Semantics → Constraints → Privacy!', delay: 22000 },
            { type: 'important', text: 'Without HSR: 3.3× more utility loss!', delay: 24000 }
        ],
        flow: [
            { id: 'hsr1', text: '8.7M Full Space', type: 'warning', x: 80, y: 20, delay: 3000 },
            { id: 'hsr2', text: 'Apply 3,000 constraints', type: 'process', x: 80, y: 80, delay: 7000 },
            { id: 'hsr3', text: '63% Reduction', type: 'result', x: 80, y: 140, delay: 13000 },
            { id: 'hsr4', text: '3.2M Effective', type: 'result', x: 80, y: 200, delay: 15000 },
            { id: 'hsr5', text: '2.7× Privacy Gain', type: 'result', x: 80, y: 260, delay: 19000 }
        ],
        stats: [
            { value: '63%', label: 'Space Reduction', type: 'highlight' },
            { value: '3,000', label: 'Constraints Applied', type: 'info' },
            { value: '18%', label: 'Critical Threshold ρ', type: 'warning' },
            { value: '2.7×', label: 'Privacy Improvement', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3], [3,4]]
    },
    21: { // RQ2 Results
        notes: [
            { type: 'stat', text: 'Privacy parameter θ = 0.37', delay: 2000 },
            { type: 'stat', text: '63% less noise needed!', delay: 4000 },
            { type: 'stat', text: 'FedAvg+DP: 12.1% accuracy loss @ ε=10', delay: 6000 },
            { type: 'stat', text: 'SCFA+DP: 3.7% accuracy loss @ ε=10', delay: 8000 },
            { type: 'stat', text: '2.7× better privacy-utility tradeoff!', delay: 10000 },
            { type: 'insight', text: 'Better privacy AND better accuracy', delay: 12000 }
        ],
        flow: [
            { id: 'p2r', text: 'RQ2', type: 'concept', x: 80, y: 30, delay: 1000 },
            { id: 'p2s', text: 'Privacy?', type: 'process', x: 80, y: 100, delay: 3000 },
            { id: 'p2t', text: 'θ = 0.37', type: 'result', x: 30, y: 170, delay: 5000 },
            { id: 'p2u', text: '63% less noise', type: 'result', x: 130, y: 170, delay: 7000 },
            { id: 'p2v', text: '2.7× better!', type: 'result', x: 80, y: 240, delay: 9000 }
        ],
        stats: [
            { value: '2.7×', label: 'Privacy-Utility Improvement', type: 'highlight' },
            { value: '3.7%', label: 'SCFA Accuracy Loss @ ε=10', type: 'highlight' },
            { value: '12.1%', label: 'FedAvg Accuracy Loss @ ε=10', type: 'warning' }
        ],
        connections: [[0,1], [1,2], [1,3], [2,4], [3,4]]
    },
    22: { // RQ3 Violations
        notes: [
            { type: 'keyword', text: 'RQ3: What if constraints are violated?', delay: 2000 },
            { type: 'method', text: 'Systematically vary violation rate ρ', delay: 4000 },
            { type: 'keyword', text: 'Find relationship: accuracy vs violations', delay: 6000 },
            { type: 'insight', text: 'Is there a tipping point?', delay: 8000 }
        ],
        flow: [
            { id: 'v3a', text: 'Vary ρ', type: 'concept', x: 80, y: 30, delay: 1500 },
            { id: 'v3b', text: '0% → 40%', type: 'process', x: 80, y: 100, delay: 3500 },
            { id: 'v3c', text: 'Measure accuracy', type: 'process', x: 80, y: 170, delay: 5500 },
            { id: 'v3d', text: 'Find threshold', type: 'result', x: 80, y: 240, delay: 7500 }
        ],
        stats: [
            { value: 'ρ', label: 'Violation Rate Variable', type: 'info' },
            { value: '0-40%', label: 'Range Tested', type: 'info' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    23: { // RQ3 Proposition
        notes: [
            { type: 'keyword', text: 'Proposition 1: Linear Degradation', delay: 2000 },
            { type: 'formula', text: 'Accuracy = A₀ · (1 - 5.2·ρ)', delay: 4000 },
            { type: 'stat', text: 'Critical threshold: ρ* = 18%', delay: 6000 },
            { type: 'insight', text: 'Below 18%: constraints help', delay: 8000 },
            { type: 'important', text: 'Above 18%: performance degrades!', delay: 10000 }
        ],
        flow: [
            { id: 'pr1', text: 'Proposition 1', type: 'concept', x: 80, y: 30, delay: 1500 },
            { id: 'pr2', text: 'Linear model', type: 'process', x: 80, y: 100, delay: 3500 },
            { id: 'pr3', text: 'ρ* = 18%', type: 'warning', x: 80, y: 170, delay: 5500 },
            { id: 'pr4', text: 'Threshold!', type: 'result', x: 80, y: 240, delay: 7500 }
        ],
        stats: [
            { value: '18%', label: 'Critical Threshold ρ*', type: 'warning' },
            { value: '5.2', label: 'Degradation Coefficient', type: 'info' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    24: { // RQ3 Results
        notes: [
            { type: 'stat', text: 'Critical threshold: ρ* = 18%', delay: 2000 },
            { type: 'insight', text: 'Below 18%: Constraints accelerate learning', delay: 4000 },
            { type: 'important', text: 'Above 18%: Performance degrades rapidly', delay: 6000 },
            { type: 'stat', text: 'Linear relationship: R² = 0.93', delay: 8000 },
            { type: 'formula', text: 'Accuracy ∝ (1 - 5.2·ρ)', delay: 10000 },
            { type: 'insight', text: 'Validated across 3 datasets', delay: 12000 }
        ],
        flow: [
            { id: 'q3r', text: 'RQ3', type: 'concept', x: 80, y: 30, delay: 1000 },
            { id: 'q3s', text: 'Violations?', type: 'process', x: 80, y: 100, delay: 3000 },
            { id: 'q3t', text: 'ρ < 18%', type: 'result', x: 30, y: 170, delay: 5000 },
            { id: 'q3u', text: 'ρ > 18%', type: 'warning', x: 130, y: 170, delay: 7000 },
            { id: 'q3v', text: 'Threshold!', type: 'result', x: 80, y: 240, delay: 9000 }
        ],
        stats: [
            { value: '18%', label: 'Critical Threshold', type: 'warning' },
            { value: '0.93', label: 'R² Linear Fit', type: 'highlight' },
            { value: '3', label: 'Datasets Validated', type: 'info' }
        ],
        connections: [[0,1], [1,2], [1,3], [2,4], [3,4]]
    },
    25: { // Key Results
        notes: [
            { type: 'stat', text: '✓ 22% faster convergence', delay: 1500 },
            { type: 'stat', text: '✓ 31% better accuracy', delay: 3000 },
            { type: 'stat', text: '✓ 2.7× better privacy-utility', delay: 4500 },
            { type: 'stat', text: '✓ 18% critical threshold identified', delay: 6000 },
            { type: 'stat', text: '✓ R² > 0.90 for all theorems', delay: 7500 },
            { type: 'stat', text: '✓ Only 0.29% compute overhead', delay: 9000 },
            { type: 'insight', text: 'Domain knowledge makes ML better!', delay: 10500 }
        ],
        flow: [
            { id: 'k1', text: 'SCFA', type: 'concept', x: 80, y: 20, delay: 1000 },
            { id: 'k2', text: '22% faster', type: 'result', x: 20, y: 90, delay: 2500 },
            { id: 'k3', text: '2.7× privacy', type: 'result', x: 140, y: 90, delay: 4000 },
            { id: 'k4', text: '18% threshold', type: 'result', x: 20, y: 160, delay: 5500 },
            { id: 'k5', text: '0.29% cost', type: 'result', x: 140, y: 160, delay: 7000 },
            { id: 'k6', text: 'Success!', type: 'result', x: 80, y: 240, delay: 8500 }
        ],
        stats: [
            { value: '22%', label: 'Faster Convergence', type: 'highlight' },
            { value: '2.7×', label: 'Privacy Improvement', type: 'highlight' },
            { value: '18%', label: 'Critical Threshold', type: 'warning' },
            { value: '0.29%', label: 'Compute Overhead', type: 'highlight' }
        ],
        connections: [[0,1], [0,2], [0,3], [0,4], [1,5], [2,5], [3,5], [4,5]]
    },
    26: { // Technical Implementation
        notes: [
            { type: 'method', text: 'Python + PyTorch implementation', delay: 2000 },
            { type: 'method', text: 'rdflib for ontology parsing', delay: 4000 },
            { type: 'method', text: 'owlready2 for OWL reasoning', delay: 6000 },
            { type: 'stat', text: '0.29% compute overhead only', delay: 8000 },
            { type: 'stat', text: 'O(|C|) validation complexity', delay: 10000 },
            { type: 'insight', text: 'Practical for production deployment', delay: 12000 }
        ],
        flow: [
            { id: 'im1', text: 'PyTorch', type: 'concept', x: 30, y: 50, delay: 1500 },
            { id: 'im2', text: 'rdflib', type: 'concept', x: 130, y: 50, delay: 3500 },
            { id: 'im3', text: 'owlready2', type: 'concept', x: 80, y: 120, delay: 5500 },
            { id: 'im4', text: 'SCFA System', type: 'result', x: 80, y: 200, delay: 7500 }
        ],
        stats: [
            { value: '0.29%', label: 'Compute Overhead', type: 'highlight' },
            { value: 'O(|C|)', label: 'Validation Complexity', type: 'info' },
            { value: 'Python', label: 'Implementation', type: 'info' }
        ],
        connections: [[0,3], [1,3], [2,3]]
    },
    27: { // Beyond Manufacturing
        notes: [
            { type: 'keyword', text: 'Healthcare: Medical device monitoring', delay: 2000 },
            { type: 'keyword', text: 'Finance: Fraud detection across banks', delay: 4000 },
            { type: 'keyword', text: 'IoT: Smart city sensor networks', delay: 6000 },
            { type: 'keyword', text: 'Energy: Power grid optimization', delay: 8000 },
            { type: 'insight', text: 'Any domain with physics/rules benefits!', delay: 10000 }
        ],
        flow: [
            { id: 'b1', text: 'SCFA Core', type: 'concept', x: 80, y: 30, delay: 1500 },
            { id: 'b2', text: '🏥 Healthcare', type: 'result', x: 20, y: 100, delay: 3000 },
            { id: 'b3', text: '💰 Finance', type: 'result', x: 140, y: 100, delay: 4500 },
            { id: 'b4', text: '🏙️ Smart City', type: 'result', x: 20, y: 170, delay: 6000 },
            { id: 'b5', text: '⚡ Energy', type: 'result', x: 140, y: 170, delay: 7500 }
        ],
        stats: [
            { value: '4+', label: 'Application Domains', type: 'info' },
            { value: '∞', label: 'Potential Use Cases', type: 'highlight' }
        ],
        connections: [[0,1], [0,2], [0,3], [0,4]]
    },
    28: { // FAQ
        notes: [
            { type: 'keyword', text: '18 common reviewer questions answered', delay: 2000 },
            { type: 'method', text: 'Click categories to explore', delay: 4000 },
            { type: 'insight', text: 'Comprehensive technical deep-dive', delay: 6000 },
            { type: 'method', text: 'Categories: Core, Technical, Privacy...', delay: 8000 }
        ],
        flow: [
            { id: 'f1', text: 'FAQ', type: 'concept', x: 80, y: 30, delay: 1500 },
            { id: 'f2', text: '18 Questions', type: 'process', x: 80, y: 100, delay: 3500 },
            { id: 'f3', text: '6 Categories', type: 'process', x: 80, y: 170, delay: 5500 },
            { id: 'f4', text: 'Interactive!', type: 'result', x: 80, y: 240, delay: 7500 }
        ],
        stats: [
            { value: '18', label: 'Questions Answered', type: 'highlight' },
            { value: '6', label: 'Categories', type: 'info' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    },
    29: { // Conclusion
        notes: [
            { type: 'insight', text: 'SCFA: Semantics + Constraints + FL', delay: 2000 },
            { type: 'stat', text: '22% faster, 2.7× better privacy', delay: 4000 },
            { type: 'keyword', text: 'Key: Domain knowledge improves ML', delay: 6000 },
            { type: 'important', text: 'Physics constraints are universal!', delay: 8000 },
            { type: 'insight', text: 'Thank you! Questions welcome.', delay: 10000 }
        ],
        flow: [
            { id: 'c1', text: 'SCFA', type: 'concept', x: 80, y: 30, delay: 1500 },
            { id: 'c2', text: 'Validated', type: 'result', x: 80, y: 100, delay: 3500 },
            { id: 'c3', text: 'Practical', type: 'result', x: 80, y: 170, delay: 5500 },
            { id: 'c4', text: 'Thank You!', type: 'result', x: 80, y: 240, delay: 7500 }
        ],
        stats: [
            { value: '✓', label: 'Theoretically Grounded', type: 'highlight' },
            { value: '✓', label: 'Empirically Validated', type: 'highlight' },
            { value: '✓', label: 'Practically Deployable', type: 'highlight' }
        ],
        connections: [[0,1], [1,2], [2,3]]
    }
};

// Initialize handwritten notes system
function initHandwrittenNotes() {
    const sketchCanvas = document.getElementById('sketchCanvas');
    const flowCanvas = document.getElementById('flowCanvas');
    
    if (sketchCanvas && typeof rough !== 'undefined') {
        resizeCanvas(sketchCanvas);
        roughCanvas = rough.canvas(sketchCanvas);
    }
    
    if (flowCanvas && typeof rough !== 'undefined') {
        resizeCanvas(flowCanvas);
        flowRoughCanvas = rough.canvas(flowCanvas);
    }
    
    // Load persisted notes for current scene
    loadPersistedNotes(currentScene);
    
    window.addEventListener('resize', () => {
        if (sketchCanvas) resizeCanvas(sketchCanvas);
        if (flowCanvas) resizeCanvas(flowCanvas);
    });
}

// Resize canvas to fit container
function resizeCanvas(canvas) {
    const container = canvas.parentElement;
    if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
}

// Add a handwritten note with typing animation
function addHandwrittenNote(type, text, animate = true) {
    const container = document.getElementById('handwrittenNotes');
    if (!container) return;
    
    const note = document.createElement('div');
    note.className = `handwritten-note ${type}`;
    
    const typeLabels = {
        keyword: 'Key Term',
        stat: 'Statistic',
        method: 'Method',
        important: 'Important!',
        insight: 'Insight',
        formula: 'Formula'
    };
    
    note.innerHTML = `
        <span class="note-type">${typeLabels[type] || type}</span>
        <span class="note-text ${type === 'stat' || type === 'important' ? 'underline' : ''}">${text}</span>
    `;
    
    container.appendChild(note);
    
    // Store for persistence
    if (!persistedNotes[currentScene]) {
        persistedNotes[currentScene] = [];
    }
    persistedNotes[currentScene].push({ type, text });
    
    // Auto-scroll to new note
    container.scrollTop = container.scrollHeight;
    
    return note;
}

// Draw a flowchart node
function addFlowNode(id, text, type, x, y) {
    const flowCanvas = document.getElementById('flowCanvas');
    const container = flowCanvas?.parentElement;
    if (!container) return;
    
    // Check if node already exists
    if (document.getElementById(`flow-${id}`)) return;
    
    const node = document.createElement('div');
    node.id = `flow-${id}`;
    node.className = `flow-node ${type}`;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    node.textContent = text;
    
    container.appendChild(node);
    
    // Store for persistence
    if (!persistedFlowcharts[currentScene]) {
        persistedFlowcharts[currentScene] = { nodes: [], connections: [] };
    }
    persistedFlowcharts[currentScene].nodes.push({ id, text, type, x, y });
    
    return node;
}

// Draw rough connection between flow nodes
function drawFlowConnection(fromIdx, toIdx, sceneData) {
    if (!flowRoughCanvas || !sceneData?.flow) return;
    
    const flowCanvas = document.getElementById('flowCanvas');
    if (!flowCanvas) return;
    
    const fromNode = sceneData.flow[fromIdx];
    const toNode = sceneData.flow[toIdx];
    if (!fromNode || !toNode) return;
    
    const startX = fromNode.x + 60;
    const startY = fromNode.y + 35;
    const endX = toNode.x + 60;
    const endY = toNode.y + 5;
    
    // Draw sketchy line
    flowRoughCanvas.line(startX, startY, endX, endY, {
        stroke: 'rgba(156, 39, 176, 0.6)',
        strokeWidth: 2,
        roughness: 1.5
    });
    
    // Draw arrow head
    const angle = Math.atan2(endY - startY, endX - startX);
    const arrowLength = 10;
    
    flowRoughCanvas.line(
        endX, endY,
        endX - arrowLength * Math.cos(angle - Math.PI/6),
        endY - arrowLength * Math.sin(angle - Math.PI/6),
        { stroke: 'rgba(156, 39, 176, 0.6)', strokeWidth: 2, roughness: 1 }
    );
    flowRoughCanvas.line(
        endX, endY,
        endX - arrowLength * Math.cos(angle + Math.PI/6),
        endY - arrowLength * Math.sin(angle + Math.PI/6),
        { stroke: 'rgba(156, 39, 176, 0.6)', strokeWidth: 2, roughness: 1 }
    );
}

// Start notes animation for a scene
function startSceneNotes(sceneIndex) {
    // Clear any existing timers
    stopSceneNotes();
    
    const sceneData = sceneNotesData[sceneIndex];
    if (!sceneData) return;
    
    // Add notes with delays
    if (sceneData.notes) {
        sceneData.notes.forEach((note, idx) => {
            // Skip if already persisted
            if (persistedNotes[sceneIndex]?.some(n => n.text === note.text)) return;
            
            const timer = setTimeout(() => {
                addHandwrittenNote(note.type, note.text);
            }, note.delay);
            noteTimers.push(timer);
        });
    }
    
    // Add flow nodes with delays
    if (sceneData.flow) {
        sceneData.flow.forEach((node, idx) => {
            // Skip if already persisted
            if (persistedFlowcharts[sceneIndex]?.nodes?.some(n => n.id === node.id)) return;
            
            const timer = setTimeout(() => {
                addFlowNode(node.id, node.text, node.type, node.x, node.y);
                
                // Draw connections after node appears
                if (sceneData.connections) {
                    sceneData.connections.forEach(([from, to]) => {
                        if (to === idx) {
                            setTimeout(() => {
                                drawFlowConnection(from, to, sceneData);
                            }, 300);
                        }
                    });
                }
            }, node.delay);
            flowTimers.push(timer);
        });
    }
}

// Stop notes animation
function stopSceneNotes() {
    noteTimers.forEach(t => clearTimeout(t));
    flowTimers.forEach(t => clearTimeout(t));
    noteTimers = [];
    flowTimers = [];
}

// Load persisted notes for a scene
function loadPersistedNotes(sceneIndex) {
    const notesContainer = document.getElementById('handwrittenNotes');
    const flowCanvas = document.getElementById('flowCanvas');
    
    // Clear current display
    if (notesContainer) notesContainer.innerHTML = '';
    
    // Clear flow canvas
    if (flowCanvas) {
        const ctx = flowCanvas.getContext('2d');
        ctx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
        
        // Remove flow nodes
        const container = flowCanvas.parentElement;
        container.querySelectorAll('.flow-node').forEach(n => n.remove());
        
        // Re-initialize rough canvas
        if (typeof rough !== 'undefined') {
            flowRoughCanvas = rough.canvas(flowCanvas);
        }
    }
    
    // Load persisted notes
    const notes = persistedNotes[sceneIndex];
    if (notes) {
        notes.forEach(note => {
            const noteEl = document.createElement('div');
            noteEl.className = `handwritten-note ${note.type}`;
            noteEl.style.animation = 'none';
            noteEl.style.opacity = '1';
            noteEl.style.transform = 'none';
            
            const typeLabels = {
                keyword: 'Key Term', stat: 'Statistic', method: 'Method',
                important: 'Important!', insight: 'Insight', formula: 'Formula'
            };
            
            noteEl.innerHTML = `
                <span class="note-type">${typeLabels[note.type] || note.type}</span>
                <span class="note-text">${note.text}</span>
            `;
            notesContainer?.appendChild(noteEl);
        });
    }
    
    // Load persisted flowchart
    const flowData = persistedFlowcharts[sceneIndex];
    if (flowData) {
        flowData.nodes.forEach(node => {
            const nodeEl = document.createElement('div');
            nodeEl.id = `flow-${node.id}`;
            nodeEl.className = `flow-node ${node.type}`;
            nodeEl.style.left = `${node.x}px`;
            nodeEl.style.top = `${node.y}px`;
            nodeEl.style.animation = 'none';
            nodeEl.style.opacity = '1';
            nodeEl.style.transform = 'none';
            nodeEl.textContent = node.text;
            flowCanvas?.parentElement?.appendChild(nodeEl);
        });
        
        // Redraw connections
        const sceneData = sceneNotesData[sceneIndex];
        if (sceneData?.connections) {
            setTimeout(() => {
                sceneData.connections.forEach(([from, to]) => {
                    drawFlowConnection(from, to, sceneData);
                });
            }, 100);
        }
    }
}

// Clear all handwritten notes
function clearHandwrittenNotes() {
    // Clear current scene's persisted data
    delete persistedNotes[currentScene];
    delete persistedFlowcharts[currentScene];
    
    // Clear display
    const notesContainer = document.getElementById('handwrittenNotes');
    if (notesContainer) notesContainer.innerHTML = '';
    
    const flowCanvas = document.getElementById('flowCanvas');
    if (flowCanvas) {
        const ctx = flowCanvas.getContext('2d');
        ctx.clearRect(0, 0, flowCanvas.width, flowCanvas.height);
        flowCanvas.parentElement.querySelectorAll('.flow-node').forEach(n => n.remove());
        if (typeof rough !== 'undefined') {
            flowRoughCanvas = rough.canvas(flowCanvas);
        }
    }
    
    // Restart notes for current scene
    startSceneNotes(currentScene);
}

// Switch insight view between flow and stats
function switchInsightView(view) {
    currentInsightView = view;
    
    const flowCanvas = document.getElementById('flowCanvas');
    const statsContainer = document.getElementById('statsContainer');
    const toggleBtns = document.querySelectorAll('.panel-toggle .toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    if (view === 'flow') {
        if (flowCanvas) flowCanvas.style.display = 'block';
        flowCanvas?.parentElement?.querySelectorAll('.flow-node').forEach(n => n.style.display = 'block');
        if (statsContainer) statsContainer.classList.add('hidden');
    } else {
        if (flowCanvas) flowCanvas.style.display = 'none';
        flowCanvas?.parentElement?.querySelectorAll('.flow-node').forEach(n => n.style.display = 'none');
        if (statsContainer) {
            statsContainer.classList.remove('hidden');
            renderStats(currentScene);
        }
    }
}

// Render stats for current scene
function renderStats(sceneIndex) {
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) return;
    
    const sceneData = sceneNotesData[sceneIndex];
    if (!sceneData?.stats) {
        statsContainer.innerHTML = '<div class="no-stats">No statistics for this slide</div>';
        return;
    }
    
    statsContainer.innerHTML = '';
    sceneData.stats.forEach((stat, idx) => {
        const card = document.createElement('div');
        card.className = `stat-card ${stat.type || 'info'}`;
        card.style.animationDelay = `${idx * 0.15}s`;
        card.innerHTML = `
            <span class="stat-value">${stat.value}</span>
            <span class="stat-label">${stat.label}</span>
        `;
        statsContainer.appendChild(card);
    });
}

// Hook into scene change - add to existing animateScene
const existingAnimateScene = animateScene;
animateScene = function(sceneIndex) {
    // Call existing function (which already calls original)
    existingAnimateScene(sceneIndex);
    
    // Add handwritten notes functionality
    handleSceneChangeForNotes(sceneIndex);
};

// Handle scene change for notes
function handleSceneChangeForNotes(sceneIndex) {
    // Stop current notes animation
    stopSceneNotes();
    
    // Load persisted notes for new scene
    loadPersistedNotes(sceneIndex);
    
    // Start new notes animation (only for new notes)
    setTimeout(() => {
        startSceneNotes(sceneIndex);
    }, 500);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHandwrittenNotes, 1000);
});

// Export functions
window.addHandwrittenNote = addHandwrittenNote;
window.addFlowNode = addFlowNode;
window.clearHandwrittenNotes = clearHandwrittenNotes;
window.switchInsightView = switchInsightView;
window.startSceneNotes = startSceneNotes;
window.stopSceneNotes = stopSceneNotes;

// ============================================
// PANEL CONTROLS & SETTINGS
// ============================================

let panelSettings = {
    globalNotes: false,
    globalInsights: false,
    slideOverrides: {}, // { sceneIndex: 'show' | 'hide' | 'inherit' }
    dontShowSuggestion: false,
    suggestionShown: false
};

let ccSettings = {
    enabled: false,
    currentText: '',
    displayTimeout: null
};

// Initialize panel controls
function initPanelControls() {
    // Load settings from localStorage if available
    const saved = localStorage.getItem('scfaPanelSettings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            panelSettings = { ...panelSettings, ...parsed };
        } catch (e) {}
    }
    
    const savedCC = localStorage.getItem('scfaCCSettings');
    if (savedCC) {
        try {
            ccSettings.enabled = JSON.parse(savedCC).enabled || false;
        } catch (e) {}
    }
    
    // Update UI to reflect settings
    updatePanelUI();
    updateCCUI();
    
    // Start suggestion timer if panels are disabled
    if (!panelSettings.globalNotes && !panelSettings.globalInsights && !panelSettings.dontShowSuggestion) {
        startSuggestionTimer();
    }
}

// Save settings to localStorage
function savePanelSettings() {
    localStorage.setItem('scfaPanelSettings', JSON.stringify(panelSettings));
}

function saveCCSettings() {
    localStorage.setItem('scfaCCSettings', JSON.stringify({ enabled: ccSettings.enabled }));
}

// Toggle settings dropdown
function togglePanelSettings() {
    const dropdown = document.getElementById('panelSettingsDropdown');
    dropdown?.classList.toggle('hidden');
    
    // Hide suggestion badge when settings opened
    const badge = document.getElementById('panelSuggestion');
    if (badge) badge.classList.add('hidden');
    
    const btn = document.getElementById('panelSettingsBtn');
    if (btn) btn.classList.remove('suggesting');
}

// Toggle global notes panel
function toggleGlobalNotes() {
    const checkbox = document.getElementById('globalNotesToggle');
    panelSettings.globalNotes = checkbox?.checked || false;
    updatePanelVisibility();
    updatePanelUI();
    savePanelSettings();
    
    // Hide suggestion if any panel enabled
    if (panelSettings.globalNotes || panelSettings.globalInsights) {
        hideSuggestionBadge();
    }
}

// Toggle global insights panel
function toggleGlobalInsights() {
    const checkbox = document.getElementById('globalInsightsToggle');
    panelSettings.globalInsights = checkbox?.checked || false;
    updatePanelVisibility();
    updatePanelUI();
    savePanelSettings();
    
    if (panelSettings.globalNotes || panelSettings.globalInsights) {
        hideSuggestionBadge();
    }
}

// Set slide-specific override
function setSlideNotesOverride() {
    const select = document.getElementById('slideNotesSelect');
    const value = select?.value || 'inherit';
    panelSettings.slideOverrides[currentScene] = value;
    updatePanelVisibility();
    savePanelSettings();
}

// Enable all panels
function enableAllPanels() {
    panelSettings.globalNotes = true;
    panelSettings.globalInsights = true;
    
    const notesToggle = document.getElementById('globalNotesToggle');
    const insightsToggle = document.getElementById('globalInsightsToggle');
    if (notesToggle) notesToggle.checked = true;
    if (insightsToggle) insightsToggle.checked = true;
    
    updatePanelVisibility();
    updatePanelUI();
    savePanelSettings();
    hideSuggestionBadge();
}

// Disable all panels
function disableAllPanels() {
    panelSettings.globalNotes = false;
    panelSettings.globalInsights = false;
    
    const notesToggle = document.getElementById('globalNotesToggle');
    const insightsToggle = document.getElementById('globalInsightsToggle');
    if (notesToggle) notesToggle.checked = false;
    if (insightsToggle) insightsToggle.checked = false;
    
    updatePanelVisibility();
    updatePanelUI();
    savePanelSettings();
}

// Update panel visibility based on settings
function updatePanelVisibility() {
    const notesPanel = document.getElementById('handwrittenPanel');
    const insightsPanel = document.getElementById('insightsPanel');
    const override = panelSettings.slideOverrides[currentScene] || 'inherit';
    
    let showNotes = panelSettings.globalNotes;
    let showInsights = panelSettings.globalInsights;
    
    // Apply slide override
    if (override === 'show') {
        showNotes = true;
        showInsights = true;
    } else if (override === 'hide') {
        showNotes = false;
        showInsights = false;
    }
    
    if (notesPanel) {
        notesPanel.classList.toggle('hidden', !showNotes);
    }
    if (insightsPanel) {
        insightsPanel.classList.toggle('hidden', !showInsights);
    }
    
    // Start/stop notes based on visibility
    if (showNotes || showInsights) {
        startSceneNotes(currentScene);
    } else {
        stopSceneNotes();
    }
}

// Update UI elements to reflect current settings
function updatePanelUI() {
    const notesToggle = document.getElementById('globalNotesToggle');
    const insightsToggle = document.getElementById('globalInsightsToggle');
    const notesStatus = document.getElementById('notesStatus');
    const insightsStatus = document.getElementById('insightsStatus');
    const slideSelect = document.getElementById('slideNotesSelect');
    
    if (notesToggle) notesToggle.checked = panelSettings.globalNotes;
    if (insightsToggle) insightsToggle.checked = panelSettings.globalInsights;
    
    if (notesStatus) {
        notesStatus.textContent = panelSettings.globalNotes ? 'ON' : 'OFF';
        notesStatus.className = 'setting-status ' + (panelSettings.globalNotes ? 'on' : 'off');
    }
    if (insightsStatus) {
        insightsStatus.textContent = panelSettings.globalInsights ? 'ON' : 'OFF';
        insightsStatus.className = 'setting-status ' + (panelSettings.globalInsights ? 'on' : 'off');
    }
    
    if (slideSelect) {
        slideSelect.value = panelSettings.slideOverrides[currentScene] || 'inherit';
    }
}

// Suggestion functionality
function startSuggestionTimer() {
    if (panelSettings.dontShowSuggestion || panelSettings.suggestionShown) return;
    
    // Show blinking badge after 5 seconds
    setTimeout(() => {
        if (!panelSettings.globalNotes && !panelSettings.globalInsights && !panelSettings.dontShowSuggestion) {
            showSuggestionBadge();
        }
    }, 5000);
    
    // Show overlay after 15 seconds if still disabled
    setTimeout(() => {
        if (!panelSettings.globalNotes && !panelSettings.globalInsights && !panelSettings.dontShowSuggestion && !panelSettings.suggestionShown) {
            showSuggestionOverlay();
        }
    }, 15000);
}

function showSuggestionBadge() {
    const badge = document.getElementById('panelSuggestion');
    const btn = document.getElementById('panelSettingsBtn');
    if (badge) badge.classList.remove('hidden');
    if (btn) btn.classList.add('suggesting');
}

function hideSuggestionBadge() {
    const badge = document.getElementById('panelSuggestion');
    const btn = document.getElementById('panelSettingsBtn');
    if (badge) badge.classList.add('hidden');
    if (btn) btn.classList.remove('suggesting');
}

function showSuggestionOverlay() {
    const overlay = document.getElementById('panelSuggestionOverlay');
    if (overlay) overlay.classList.remove('hidden');
    panelSettings.suggestionShown = true;
}

function hideSuggestion() {
    const overlay = document.getElementById('panelSuggestionOverlay');
    if (overlay) overlay.classList.add('hidden');
    hideSuggestionBadge();
}

function setDontShowAgain() {
    const checkbox = document.getElementById('dontShowAgain');
    panelSettings.dontShowSuggestion = checkbox?.checked || false;
    savePanelSettings();
}

// ============================================
// CLOSED CAPTIONS (CC)
// ============================================

function toggleCC() {
    ccSettings.enabled = !ccSettings.enabled;
    updateCCUI();
    saveCCSettings();
    
    // Show/hide settings dropdown
    const dropdown = document.getElementById('ccSettingsDropdown');
    if (ccSettings.enabled && dropdown) {
        dropdown.classList.remove('hidden');
    }
    
    if (!ccSettings.enabled) {
        hideCC();
        if (dropdown) dropdown.classList.add('hidden');
    }
}

function updateCCUI() {
    const btn = document.getElementById('ccToggleBtn');
    const status = document.getElementById('ccStatus');
    const container = document.getElementById('ccContainer');
    
    if (btn) btn.classList.toggle('active', ccSettings.enabled);
    if (status) {
        status.textContent = ccSettings.enabled ? 'ON' : 'OFF';
        status.className = 'cc-status ' + (ccSettings.enabled ? 'on' : 'off');
    }
    if (container && !ccSettings.enabled) {
        container.classList.add('hidden');
    }
}

// CC Opacity Control
function setCCOpacity(value) {
    const container = document.getElementById('ccContainer');
    const valueDisplay = document.getElementById('ccOpacityValue');
    
    if (container) {
        container.style.opacity = value / 100;
    }
    if (valueDisplay) {
        valueDisplay.textContent = value + '%';
    }
    
    // Save preference
    localStorage.setItem('scfaCCOpacity', value);
}

// CC Font Size Control
function setCCFontSize(value) {
    const textEl = document.getElementById('ccText');
    if (textEl) {
        textEl.style.fontSize = value;
    }
    localStorage.setItem('scfaCCFontSize', value);
}

// Initialize CC settings from localStorage
function initCCSettings() {
    const savedOpacity = localStorage.getItem('scfaCCOpacity');
    const savedFontSize = localStorage.getItem('scfaCCFontSize');
    
    if (savedOpacity) {
        const slider = document.getElementById('ccOpacitySlider');
        if (slider) slider.value = savedOpacity;
        setCCOpacity(savedOpacity);
    }
    
    if (savedFontSize) {
        const select = document.getElementById('ccFontSize');
        if (select) select.value = savedFontSize;
        setCCFontSize(savedFontSize);
    }
}

function showCC(text) {
    if (!ccSettings.enabled || !text) return;
    
    const container = document.getElementById('ccContainer');
    const textEl = document.getElementById('ccText');
    
    if (!container || !textEl) return;
    
    container.classList.remove('hidden');
    
    // Apply saved opacity
    const savedOpacity = localStorage.getItem('scfaCCOpacity') || 85;
    container.style.opacity = savedOpacity / 100;
    
    // Display text directly - speech synthesis handles timing
    // Show in chunks for better readability
    const maxChars = 150;
    if (text.length > maxChars) {
        // Find a good break point
        let breakPoint = text.lastIndexOf('. ', maxChars);
        if (breakPoint === -1) breakPoint = text.lastIndexOf(' ', maxChars);
        if (breakPoint === -1) breakPoint = maxChars;
        
        const displayText = text.substring(0, breakPoint + 1);
        textEl.textContent = displayText;
        
        // Store remaining text for later
        ccSettings.remainingText = text.substring(breakPoint + 1).trim();
        ccSettings.currentText = displayText;
    } else {
        textEl.textContent = text;
        ccSettings.currentText = text;
        ccSettings.remainingText = '';
    }
    
    // Clear any existing timeout
    if (ccSettings.displayTimeout) {
        clearTimeout(ccSettings.displayTimeout);
    }
}

function showNextCCChunk() {
    if (!ccSettings.enabled || !ccSettings.remainingText) return;
    
    const textEl = document.getElementById('ccText');
    if (!textEl) return;
    
    const maxChars = 150;
    const text = ccSettings.remainingText;
    
    if (text.length > maxChars) {
        let breakPoint = text.lastIndexOf('. ', maxChars);
        if (breakPoint === -1) breakPoint = text.lastIndexOf(' ', maxChars);
        if (breakPoint === -1) breakPoint = maxChars;
        
        textEl.textContent = text.substring(0, breakPoint + 1);
        ccSettings.remainingText = text.substring(breakPoint + 1).trim();
    } else {
        textEl.textContent = text;
        ccSettings.remainingText = '';
    }
}

function hideCC() {
    const container = document.getElementById('ccContainer');
    if (container) container.classList.add('hidden');
    ccSettings.currentText = '';
    ccSettings.remainingText = '';
}

function updateCCFromSpeech(text) {
    if (ccSettings.enabled && text) {
        showCC(text);
    }
}

// Hook into speech synthesis to show CC
// We need to intercept the speak calls made by the narration system
const originalSpeechSpeak = window.speechSynthesis?.speak?.bind(window.speechSynthesis);

if (originalSpeechSpeak && window.speechSynthesis) {
    const synth = window.speechSynthesis;
    synth.speak = function(utterance) {
        // Show CC when speech starts
        if (ccSettings.enabled && utterance && utterance.text) {
            showCC(utterance.text);
            
            // Update CC with boundary events for better sync
            utterance.addEventListener('boundary', (event) => {
                if (event.name === 'word' && ccSettings.enabled && ccSettings.remainingText) {
                    // Periodically show next chunk
                    if (event.charIndex > 100) {
                        showNextCCChunk();
                    }
                }
            });
            
            // Hide CC when speech ends
            utterance.addEventListener('end', () => {
                if (ccSettings.displayTimeout) clearTimeout(ccSettings.displayTimeout);
                ccSettings.displayTimeout = setTimeout(hideCC, 2000);
            });
            
            utterance.addEventListener('error', () => {
                if (ccSettings.displayTimeout) clearTimeout(ccSettings.displayTimeout);
                ccSettings.displayTimeout = setTimeout(hideCC, 1000);
            });
        }
        
        return originalSpeechSpeak.call(synth, utterance);
    };
}

// Hook into scene change to update panel visibility - this is the final consolidated hook
// Note: animateScene has been hooked twice before this (KG init, handwritten notes)
// We add our panel controls functionality to the chain
const existingAnimateSceneForPanels = animateScene;
animateScene = function(sceneIndex) {
    existingAnimateSceneForPanels(sceneIndex);
    
    // Update panel UI for new scene
    setTimeout(() => {
        updatePanelUI();
        updatePanelVisibility();
        // Also update stats if in stats view
        if (currentInsightView === 'stats') {
            renderStats(sceneIndex);
        }
    }, 100);
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initPanelControls();
        initCCSettings();
    }, 500);
});

// Export functions
window.togglePanelSettings = togglePanelSettings;
window.toggleGlobalNotes = toggleGlobalNotes;
window.toggleGlobalInsights = toggleGlobalInsights;
window.setSlideNotesOverride = setSlideNotesOverride;
window.enableAllPanels = enableAllPanels;
window.disableAllPanels = disableAllPanels;
window.hideSuggestion = hideSuggestion;
window.setDontShowAgain = setDontShowAgain;
window.toggleCC = toggleCC;
window.showCC = showCC;
window.hideCC = hideCC;
window.setCCOpacity = setCCOpacity;
window.setCCFontSize = setCCFontSize;
window.renderStats = renderStats;

// ============================================
// ENHANCED HSR SIMULATOR - Interactive Visualization
// ============================================

const HSRSimulator = {
    currentStep: 0,
    maxSteps: 4,
    isPlaying: false,
    playInterval: null,
    speed: 1,
    validPoints: 6,
    invalidPoints: 44,
    
    // Constraint data with detailed info
    constraints: [
        { 
            name: 'Initial', 
            fullName: 'Initial State',
            reduction: 0, 
            cumulative: 0, 
            params: 8.7, 
            color: '#666',
            description: 'All 8.7M parameter configurations visible',
            rule: '',
            ringId: null,
            labelId: null
        },
        { 
            name: 'Temporal', 
            fullName: 'Temporal Constraints',
            reduction: 28, 
            cumulative: 28, 
            params: 6.26, 
            color: '#ff9800',
            description: 'Removing temporal violations (wear must increase)',
            rule: '∂W/∂t ≥ 0',
            ringId: 'simTempRing',
            labelId: 'tempLabel'
        },
        { 
            name: 'Causal', 
            fullName: 'Causal Constraints',
            reduction: 18, 
            cumulative: 46, 
            params: 4.70, 
            color: '#2196f3',
            description: 'Removing acausal relationships',
            rule: 't_cause < t_effect',
            ringId: 'simCausalRing',
            labelId: 'causalLabel'
        },
        { 
            name: 'Capacity', 
            fullName: 'Capacity Constraints',
            reduction: 12, 
            cumulative: 58, 
            params: 3.65, 
            color: '#9c27b0',
            description: 'Enforcing physical bounds on values',
            rule: 'T ∈ [20°C, 200°C]',
            ringId: 'simCapRing',
            labelId: 'capLabel'
        },
        { 
            name: 'Physical', 
            fullName: 'Physical Laws',
            reduction: 5, 
            cumulative: 63, 
            params: 3.22, 
            color: '#f44336',
            description: 'Applying conservation laws',
            rule: '∑E_in = ∑E_out',
            ringId: null,
            labelId: 'physLabel'
        }
    ],
    
    // Privacy multiplier calculation: 1/(1-θ)
    getPrivacyMultiplier(reduction) {
        if (reduction === 0) return 1;
        const theta = reduction / 100;
        return (1 / (1 - theta)).toFixed(2);
    },
    
    // Initialize the simulator
    init() {
        this.generateSimulatorPoints();
        this.updateAllDisplays();
        this.setupSpeedSlider();
    },
    
    // Setup speed slider listener
    setupSpeedSlider() {
        const speedSlider = document.getElementById('simSpeed');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.speed = parseFloat(e.target.value);
                const label = document.getElementById('speedLabel');
                if (label) label.textContent = this.speed + '×';
            });
        }
    },
    
    // Generate random points for simulator with specific distribution
    generateSimulatorPoints() {
        const pointsContainer = document.getElementById('simPoints');
        if (!pointsContainer) return;
        
        pointsContainer.innerHTML = '';
        const centerX = 220, centerY = 250;
        const fullRadius = 165;
        const validRadius = 50;
        
        // Constraint type distribution for invalid points
        const constraintTypes = ['temporal', 'causal', 'capacity', 'physical'];
        const constraintRadii = [160, 140, 110, 80]; // Radii for each constraint zone
        
        // Generate invalid points in different constraint zones
        let invalidCount = 0;
        constraintTypes.forEach((type, idx) => {
            const outerR = idx === 0 ? fullRadius : constraintRadii[idx - 1];
            const innerR = constraintRadii[idx];
            const pointsInZone = [10, 8, 6, 4][idx]; // Points per zone
            
            for (let i = 0; i < pointsInZone; i++) {
                const angle = Math.random() * Math.PI * 2;
                const minR = innerR + 5;
                const maxR = outerR - 5;
                const distance = minR + Math.random() * (maxR - minR);
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', 4);
                circle.setAttribute('fill', '#f44336');
                circle.setAttribute('class', 'sim-point invalid');
                circle.setAttribute('data-constraint', type);
                circle.setAttribute('opacity', '0.7');
                circle.style.transition = 'all 0.5s ease';
                
                pointsContainer.appendChild(circle);
                invalidCount++;
            }
        });
        
        // Generate valid points inside the valid region
        for (let i = 0; i < this.validPoints; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * validRadius * 0.8;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 5);
            circle.setAttribute('fill', '#4caf50');
            circle.setAttribute('class', 'sim-point valid');
            circle.setAttribute('filter', 'url(#glowLg)');
            
            pointsContainer.appendChild(circle);
        }
        
        this.invalidPoints = invalidCount;
    },
    
    // Reset simulation
    reset() {
        this.currentStep = 0;
        this.stop();
        this.resetPoints();
        this.resetRingsAndLabels();
        this.updateAllDisplays();
    },
    
    // Reset all points visibility
    resetPoints() {
        document.querySelectorAll('.sim-point.invalid').forEach(p => {
            p.setAttribute('opacity', '0.7');
            p.classList.remove('eliminated');
        });
    },
    
    // Reset constraint rings and labels
    resetRingsAndLabels() {
        ['simTempRing', 'simCausalRing', 'simCapRing'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('opacity', '0');
        });
        
        ['tempLabel', 'causalLabel', 'capLabel', 'physLabel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('opacity', '0');
        });
    },
    
    // Step forward
    step() {
        if (this.currentStep < this.maxSteps) {
            this.currentStep++;
            this.applyStep(this.currentStep);
            this.updateAllDisplays();
        }
    },
    
    // Apply specific step with animations
    applyStep(step) {
        const data = this.constraints[step];
        const constraintTypes = ['temporal', 'causal', 'capacity', 'physical'];
        const type = constraintTypes[step - 1];
        
        // Eliminate points of this constraint type with animation
        document.querySelectorAll(`.sim-point[data-constraint="${type}"]`).forEach((p, i) => {
            setTimeout(() => {
                p.classList.add('eliminated');
                p.setAttribute('opacity', '0.1');
                p.setAttribute('r', '2');
            }, i * 50);
        });
        
        // Show constraint ring if available
        if (data.ringId) {
            const ring = document.getElementById(data.ringId);
            if (ring) {
                ring.setAttribute('opacity', '0.8');
            }
        }
        
        // Show constraint label
        if (data.labelId) {
            const label = document.getElementById(data.labelId);
            if (label) {
                label.setAttribute('opacity', '1');
            }
        }
        
        // Update pipeline nodes
        this.updatePipelineNodes();
    },
    
    // Update pipeline visual
    updatePipelineNodes() {
        const pipelineContainer = document.getElementById('pipelineVisual');
        if (!pipelineContainer) return;
        
        const nodes = pipelineContainer.querySelectorAll('.pipe-node');
        nodes.forEach((node, i) => {
            const circle = node.querySelector('div[style*="border-radius:50%"]');
            const label = node.querySelector('div[style*="font-size:0.6rem"]');
            
            if (i < this.currentStep) {
                // Completed
                if (circle) {
                    circle.style.background = '#4caf50';
                    circle.style.borderColor = '#4caf50';
                    circle.style.color = 'white';
                }
                if (label) label.style.color = '#4caf50';
            } else if (i === this.currentStep) {
                // Active
                if (circle) {
                    circle.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
                    circle.style.borderColor = '#667eea';
                    circle.style.color = 'white';
                }
                if (label) label.style.color = '#e0e0e0';
            } else {
                // Future - reset to default
                const colors = ['#667eea', '#ff9800', '#2196f3', '#9c27b0', '#f44336'];
                if (circle) {
                    circle.style.background = 'transparent';
                    circle.style.borderColor = colors[i] || '#666';
                    circle.style.color = colors[i] || '#666';
                }
                if (label) label.style.color = '#9e9e9e';
            }
        });
    },
    
    // Update all displays
    updateAllDisplays() {
        const data = this.constraints[this.currentStep];
        
        // Step display
        const stepNum = document.getElementById('simStepNum');
        const stepTitle = document.getElementById('simStepTitle');
        const stepDesc = document.getElementById('simStepDesc');
        
        if (stepNum) stepNum.textContent = this.currentStep;
        if (stepTitle) stepTitle.textContent = data.fullName;
        if (stepDesc) stepDesc.textContent = data.description;
        
        // Metrics
        const simSpaceSize = document.getElementById('simSpaceSize');
        const simSpaceFill = document.getElementById('simSpaceFill');
        const simReduction = document.getElementById('simReduction');
        const simReductionFill = document.getElementById('simReductionFill');
        const simPrivacy = document.getElementById('simPrivacy');
        const simEliminated = document.getElementById('simEliminated');
        
        if (simSpaceSize) simSpaceSize.textContent = data.params.toFixed(1) + 'M';
        if (simSpaceFill) simSpaceFill.style.width = ((100 - data.cumulative)) + '%';
        if (simReduction) simReduction.textContent = data.cumulative + '%';
        if (simReductionFill) simReductionFill.style.width = data.cumulative + '%';
        if (simPrivacy) simPrivacy.textContent = this.getPrivacyMultiplier(data.cumulative) + '×';
        
        // Count eliminated points
        const eliminated = document.querySelectorAll('.sim-point.eliminated').length;
        if (simEliminated) simEliminated.textContent = `${eliminated} / ${this.invalidPoints} eliminated`;
        
        // SVG stats
        const svgValidCount = document.getElementById('svgValidCount');
        const svgEliminatedCount = document.getElementById('svgEliminatedCount');
        const svgSNR = document.getElementById('svgSNR');
        
        if (svgValidCount) svgValidCount.textContent = this.validPoints;
        if (svgEliminatedCount) svgEliminatedCount.textContent = eliminated;
        if (svgSNR) svgSNR.textContent = this.getPrivacyMultiplier(data.cumulative) + '×';
        
        // Result section in SVG
        const simReductionPct = document.getElementById('simReductionPct');
        const simResultSize = document.getElementById('simResultSize');
        const simPrivacyResult = document.getElementById('simPrivacyResult');
        
        if (simReductionPct) simReductionPct.textContent = data.cumulative + '%';
        if (simResultSize) simResultSize.textContent = data.params.toFixed(1) + 'M';
        if (simPrivacyResult) simPrivacyResult.textContent = this.getPrivacyMultiplier(data.cumulative) + '× Privacy';
        
        // Formula section
        const simSNRAfter = document.getElementById('simSNRAfter');
        const simSNRGain = document.getElementById('simSNRGain');
        
        if (simSNRAfter) simSNRAfter.textContent = `SNR = S / (σ² × ${data.params.toFixed(1)}M)`;
        if (simSNRGain) simSNRGain.textContent = `= ${this.getPrivacyMultiplier(data.cumulative)}× SNR₀`;
        
        // Pipeline nodes
        this.updatePipelineNodes();
    },
    
    // Play/pause toggle
    togglePlay() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    },
    
    // Start playing
    play() {
        if (this.currentStep >= this.maxSteps) {
            this.reset();
        }
        
        this.isPlaying = true;
        this.updatePlayButton(true);
        
        const interval = 2000 / this.speed;
        this.playInterval = setInterval(() => {
            if (this.currentStep < this.maxSteps) {
                this.step();
            } else {
                this.stop();
            }
        }, interval);
    },
    
    // Stop playing
    stop() {
        this.isPlaying = false;
        this.updatePlayButton(false);
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    },
    
    // Update play button state
    updatePlayButton(playing) {
        const simBtn = document.getElementById('simPlayBtn');
        
        if (simBtn) {
            simBtn.innerHTML = playing ? '<span>⏸</span> Pause' : '<span>▶</span> Play';
            simBtn.classList.toggle('playing', playing);
        }
    }
};

// Global functions for button onclick handlers - defined immediately
function openHSRSimulator() {
    console.log('openHSRSimulator called');
    try {
        const modal = document.getElementById('hsrModal');
        console.log('Modal found:', modal);
        if (modal) {
            modal.style.display = 'flex';
            modal.style.alignItems = 'flex-start';
            modal.style.justifyContent = 'center';
            modal.style.paddingTop = '20px';
            document.body.style.overflow = 'hidden';
            if (typeof HSRSimulator !== 'undefined') {
                HSRSimulator.init();
                HSRSimulator.reset();
            }
        } else {
            console.error('Modal not found!');
            alert('Error: Modal not found');
        }
    } catch(e) {
        console.error('Error opening simulator:', e);
        alert('Error: ' + e.message);
    }
}

function closeHSRSimulator() {
    try {
        const modal = document.getElementById('hsrModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            if (typeof HSRSimulator !== 'undefined') {
                HSRSimulator.stop();
            }
        }
    } catch(e) {
        console.error('Error closing simulator:', e);
    }
}

// Make functions available immediately
window.openHSRSimulator = openHSRSimulator;
window.closeHSRSimulator = closeHSRSimulator;

function simReset() {
    HSRSimulator.reset();
}

function simPlayPause() {
    HSRSimulator.togglePlay();
}

function simStep() {
    HSRSimulator.step();
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeHSRSimulator();
    }
});

// Export to window
window.openHSRSimulator = openHSRSimulator;
window.closeHSRSimulator = closeHSRSimulator;
window.simReset = simReset;
window.simPlayPause = simPlayPause;
window.simStep = simStep;
window.HSRSimulator = HSRSimulator;
