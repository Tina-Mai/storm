# About the project

I'm taking an intro to probability for computer scientists class. I need to create a probability-driven project that highlights concepts from the class and does something interesting. I'm scored on creativity, impact (positive societal benefit), and academic sophistication.

My project, STORM (statistical tools for optimizing resource management), uses Beta distributions and Thompson sampling to approach the multi-armed bandit problem of optimizing disaster relief resources.

---

## Core Idea

The project simulates a disaster scenario where limited resources (e.g., food, water, medical kits) must be allocated across affected regions. Using a **multi-armed bandit approach** with **Thompson Sampling**, the model learns over time to balance:

1. **Immediate needs**: Allocating resources to regions with urgent demands (e.g., injured people, food shortages).
2. **Long-term recovery**: Ensuring regions have enough supplies to sustain recovery (e.g., rebuilding infrastructure).

Users interact with the simulation through a **web app** to:

1. Input disaster severity, resource availability, and recovery parameters.
2. Visualize how the bandit algorithm dynamically optimizes resource allocation.
3. Experiment with different strategies and observe the outcomes.

---

## Probabilistic Techniques Used

1. **Multi-Armed Bandits (MAB)**:

    - Each region is treated as an "arm" of the bandit.
    - Thompson Sampling balances **exploration** (learning about less-supported regions) and **exploitation** (prioritizing regions with high immediate demand).
    - Reward signals are based on the region's unmet demand or recovery progress.

2. **Thompson Sampling**:

    - For each "arm" (region), maintain a Beta distribution \( \text{Beta}(\alpha, \beta) \) representing the success/failure rates.
    - Sample from this distribution to decide where to allocate resources.

3. **Random Variables and Uncertainty**:

    - Model demand as random variables with probabilistic distributions (e.g., Poisson or Gaussian).

4. **Optimization under Constraints**:
    - Optimize the allocation while considering constraints like limited total resources.

---

## Implementation Steps

### 1. Define the Simulation

-   **Regions and Resource Needs**:

    -   Define 3–5 regions, each with a random demand distribution.
    -   For example:

        ```python
        import numpy as np

        n_regions = 3
        demands = [np.random.poisson(lam=100) for _ in range(n_regions)]
        ```

-   **Dynamic Changes**:

    -   Add random variability to demands over time to simulate evolving disaster scenarios.

-   **Reward Signal**:
    -   Define the reward as the fraction of demand met:
        \[
        R_i = \frac{\text{Allocated Resources}\_i}{\text{Demand}\_i}
        \]
    -   Reward is capped at 1 to represent full satisfaction of demand.

---

### 2. Implement Thompson Sampling

1. **Initialization**:

    - Each region starts with a prior Beta distribution \( \text{Beta}(1, 1) \) (equal prior belief for success and failure).

2. **Simulation Loop**:

    - At each time step:
        - Sample from the Beta distribution for each region.
        - Allocate resources to the region with the highest sampled value.
        - Update the Beta parameters (\( \alpha, \beta \)) based on whether the allocation was successful (reward observed).

3. **Python Code Example**:

    ```python
    import numpy as np

    # Initialize regions
    n_regions = 3
    total_resources = 300
    demands = [np.random.poisson(lam=100) for _ in range(n_regions)]

    # Initialize Beta distribution parameters for each region
    alpha = np.ones(n_regions)  # Successes
    beta = np.ones(n_regions)  # Failures

    # Thompson Sampling loop
    n_rounds = 10
    for t in range(n_rounds):
        # Sample from Beta distributions
        samples = [np.random.beta(alpha[i], beta[i]) for i in range(n_regions)]
        # Choose the region with the highest sampled value
        chosen_region = np.argmax(samples)

        # Simulate resource allocation
        allocated = total_resources // n_regions  # Equal allocation for simplicity
        reward = min(allocated, demands[chosen_region]) / demands[chosen_region]

        # Update Beta distribution
        alpha[chosen_region] += reward  # Increment successes
        beta[chosen_region] += (1 - reward)  # Increment failures

        # Print results
        print(f"Round {t + 1}: Region {chosen_region + 1} chosen, Reward: {reward:.2f}")
    ```

---

### 3. Add Dynamic User Interaction (React Frontend)

1. **User Inputs**:

    - Disaster severity: A slider to adjust baseline demands for all regions.
    - Resource constraints: Allow users to change total resources.
    - Time steps: Allow users to pause, resume, or restart the simulation.

2. **Visualizations**:

    - **Region Status**: A dynamic bar chart showing demand, allocated resources, and unmet demand for each region.
    - **Beta Distributions**: Display evolving Beta distributions as line charts or histograms for each region.
    - **Reward Trend**: A line graph showing cumulative rewards over time.

3. **Interactivity**:
    - Let users experiment with different strategies:
        - Manual allocation (fixed percentages for regions).
        - Automated allocation (Thompson Sampling).
    - Compare the performance of the strategies visually.

---

### 4. Backend and Frontend Communication

1. **Backend (Python)**:

    - **Endpoints**:
        - `/simulate`: Runs the Thompson Sampling simulation for a given number of rounds and returns updated rewards and Beta parameters.
        - `/update`: Accepts user inputs (e.g., severity, resources) and re-initializes the simulation.

2. **Frontend (React)**:

    - **UI Components**:

        - Input sliders for severity and resources.
        - Start, Pause, and Reset buttons.
        - Interactive charts for Beta distributions and resource allocation.

    - **Visualization Libraries**:
        - Use [Chart.js](https://react-chartjs-2.js.org/) or [Recharts](https://recharts.org/) for dynamic charts.
        - Use animations to show changes in distributions and resource allocation.

---

### 5. Demonstrate Learning and Impact

1. **Showcase Exploration-Exploitation**:

    - Highlight how the algorithm initially explores regions with high uncertainty and gradually shifts focus to regions with consistently high rewards.

2. **Compare Strategies**:

    - Add a manual allocation mode where users control resource distribution with sliders.
    - Let users compare the outcomes (e.g., total unmet demand, reward trends) of manual vs. Thompson Sampling allocation.

3. **Heatmap**:
    - Display a heatmap of regions showing demand intensity and satisfaction levels over time.

---

## Deliverables

1. **Backend**:

    - A working simulation of Thompson Sampling with clear API endpoints.

2. **Frontend**:

    - An interactive React web app with dynamic inputs, visualizations, and performance comparisons.

3. **Documentation**:
    - Explain the Thompson Sampling algorithm and its application to resource allocation.
    - Include insights on how adaptive strategies improve disaster response outcomes.
