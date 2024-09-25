// Define the PlayerAttributes type
type PlayerAttributes = {
  // Ball Skills
  ballControl: number;
  dribbling: number;

  // Defence
  marking: number;
  slideTackle: number;
  standTackle: number;

  // Mental
  aggression: number;
  reactions: number;
  attPosition: number;
  interceptions: number;
  vision: number;
  composure: number;

  // Passing
  crossing: number;
  shortPass: number;
  longPass: number;

  // Physical
  acceleration: number;
  stamina: number;
  strength: number;
  balance: number;
  sprintSpeed: number;
  agility: number;
  jumping: number;

  // Shooting
  heading: number;
  shotPower: number;
  finishing: number;
  longShots: number;
  curve: number;
  fkAccuracy: number;
  penalties: number;
  volleys: number;

  // Goalkeeper
  gkPositioning: number;
  gkDiving: number;
  gkHandling: number;
  gkKicking: number;
  gkReflexes: number;

  // Specialities and Traits
  specialities: string[];
  traits: string[];
};

// Define the Team type
type Team = {
  name: string;
  players: PlayerAttributes[];
  attackRating: number;
  defenseRating: number;
  possessionStyle: number;
  aggressiveness: number;
  passingSkill: number;
};

// Define the MatchStatistics type
type MatchStatistics = {
  possession: number;
  expectedGoals: number;
  shots: number;
  shotsOnTarget: number;
  goals: number;
  saves: number;
  corners: number;
  fouls: number;
  passesCompleted: number;
  tackles: number;
  yellowCards: number;
  redCards: number;
};

// Helper function to generate a random number within a range
function getRandomStat(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a player with random attributes
function generateRandomPlayer(): PlayerAttributes {
  return {
    // Ball Skills
    ballControl: getRandomStat(50, 100),
    dribbling: getRandomStat(50, 100),

    // Defence
    marking: getRandomStat(30, 90),
    slideTackle: getRandomStat(30, 90),
    standTackle: getRandomStat(30, 90),

    // Mental
    aggression: getRandomStat(30, 90),
    reactions: getRandomStat(50, 100),
    attPosition: getRandomStat(50, 100),
    interceptions: getRandomStat(30, 90),
    vision: getRandomStat(50, 100),
    composure: getRandomStat(50, 100),

    // Passing
    crossing: getRandomStat(50, 100),
    shortPass: getRandomStat(50, 100),
    longPass: getRandomStat(50, 100),

    // Physical
    acceleration: getRandomStat(50, 100),
    stamina: getRandomStat(50, 100),
    strength: getRandomStat(50, 100),
    balance: getRandomStat(50, 100),
    sprintSpeed: getRandomStat(50, 100),
    agility: getRandomStat(50, 100),
    jumping: getRandomStat(50, 100),

    // Shooting
    heading: getRandomStat(30, 90),
    shotPower: getRandomStat(50, 100),
    finishing: getRandomStat(50, 100),
    longShots: getRandomStat(50, 100),
    curve: getRandomStat(50, 100),
    fkAccuracy: getRandomStat(50, 100),
    penalties: getRandomStat(50, 100),
    volleys: getRandomStat(50, 100),

    // Goalkeeper
    gkPositioning: getRandomStat(1, 15),
    gkDiving: getRandomStat(1, 15),
    gkHandling: getRandomStat(1, 15),
    gkKicking: getRandomStat(1, 15),
    gkReflexes: getRandomStat(1, 15),

    // Specialities and Traits (simplified as empty arrays for random players)
    specialities: [],
    traits: [],
  };
}

// Function to create a team with 11 random players
function createRandomTeam(name: string): Team {
  const players: PlayerAttributes[] = [];
  for (let i = 0; i < 11; i++) {
    players.push(generateRandomPlayer());
  }
  return {
    name,
    players,
    attackRating: 0,
    defenseRating: 0,
    possessionStyle: 0,
    aggressiveness: 0,
    passingSkill: 0,
  };
}

// Function to calculate team attributes based on players
function calculateTeamAttributes(team: Team): void {
  const { players } = team;
  const numPlayers = players.length;

  let totalAttack = 0;
  let totalDefense = 0;
  let totalPossession = 0;
  let totalAggressiveness = 0;
  let totalPassing = 0;

  players.forEach((player) => {
    totalAttack +=
      (player.finishing + player.attPosition + player.shotPower) / 3;
    totalDefense +=
      (player.marking +
        player.slideTackle +
        player.standTackle +
        player.interceptions) /
      4;
    totalPossession +=
      (player.ballControl +
        player.shortPass +
        player.longPass +
        player.dribbling +
        player.vision) /
      5;
    totalAggressiveness +=
      (player.aggression + player.slideTackle + player.standTackle) / 3;
    totalPassing += (player.shortPass + player.longPass + player.crossing) / 3;
  });

  team.attackRating = totalAttack / numPlayers;
  team.defenseRating = totalDefense / numPlayers;
  team.possessionStyle = totalPossession / numPlayers;
  team.aggressiveness = totalAggressiveness / numPlayers;
  team.passingSkill = totalPassing / numPlayers;
}

// Simulation functions and helper functions
function simulateMatch(
  teamA: Team,
  teamB: Team,
): [MatchStatistics, MatchStatistics] {
  // First, calculate team attributes based on players
  calculateTeamAttributes(teamA);
  calculateTeamAttributes(teamB);

  // Initialize statistics
  const statsA: MatchStatistics = initializeMatchStatistics();
  const statsB: MatchStatistics = initializeMatchStatistics();

  // Calculate possession percentages
  const possessionA = teamA.passingSkill * teamA.possessionStyle;
  const possessionB = teamB.passingSkill * teamB.possessionStyle;
  const totalPossession = possessionA + possessionB;
  statsA.possession = (possessionA / totalPossession) * 100;
  statsB.possession = 100 - statsA.possession;

  // Simulate passes completed
  const totalPasses = 900; // Average total passes in a match
  statsA.passesCompleted = Math.round(
    (statsA.possession / 100) * totalPasses * (teamA.passingSkill / 100),
  );
  statsB.passesCompleted = Math.round(
    (statsB.possession / 100) * totalPasses * (teamB.passingSkill / 100),
  );

  // Simulate shots
  const averageShots = 15; // Average shots per team per match
  statsA.shots = poissonRandomVariable(
    averageShots * (teamA.attackRating / 100),
  );
  statsB.shots = poissonRandomVariable(
    averageShots * (teamB.attackRating / 100),
  );

  // Simulate shots on target
  statsA.shotsOnTarget = Math.round(statsA.shots * (teamA.attackRating / 150));
  statsB.shotsOnTarget = Math.round(statsB.shots * (teamB.attackRating / 150));

  // Simulate expected goals (xG)
  statsA.expectedGoals =
    statsA.shotsOnTarget * 0.1 * (teamA.attackRating / 100);
  statsB.expectedGoals =
    statsB.shotsOnTarget * 0.1 * (teamB.attackRating / 100);

  // Simulate goals scored
  statsA.goals = binomialRandomVariable(
    statsA.shotsOnTarget,
    calculateScoringProbability(teamA, teamB),
  );
  statsB.goals = binomialRandomVariable(
    statsB.shotsOnTarget,
    calculateScoringProbability(teamB, teamA),
  );

  // Simulate saves
  statsA.saves = statsB.shotsOnTarget - statsB.goals;
  statsB.saves = statsA.shotsOnTarget - statsA.goals;

  // Simulate fouls
  const averageFouls = 15;
  statsA.fouls = poissonRandomVariable(
    averageFouls * (teamA.aggressiveness / 100),
  );
  statsB.fouls = poissonRandomVariable(
    averageFouls * (teamB.aggressiveness / 100),
  );

  // Simulate yellow cards
  statsA.yellowCards = binomialRandomVariable(statsA.fouls, 0.1);
  statsB.yellowCards = binomialRandomVariable(statsB.fouls, 0.1);

  // Simulate red cards
  statsA.redCards = binomialRandomVariable(statsA.yellowCards, 0.1);
  statsB.redCards = binomialRandomVariable(statsB.yellowCards, 0.1);

  // Simulate corners
  statsA.corners = poissonRandomVariable(statsA.shots * 0.2);
  statsB.corners = poissonRandomVariable(statsB.shots * 0.2);

  // Simulate tackles
  statsA.tackles = Math.round(
    statsB.passesCompleted * (teamA.defenseRating / 100) * 0.1,
  );
  statsB.tackles = Math.round(
    statsA.passesCompleted * (teamB.defenseRating / 100) * 0.1,
  );

  return [statsA, statsB];
}

function initializeMatchStatistics(): MatchStatistics {
  return {
    possession: 0,
    expectedGoals: 0,
    shots: 0,
    shotsOnTarget: 0,
    goals: 0,
    saves: 0,
    corners: 0,
    fouls: 0,
    passesCompleted: 0,
    tackles: 0,
    yellowCards: 0,
    redCards: 0,
  };
}

function calculateScoringProbability(
  attackingTeam: Team,
  defendingTeam: Team,
): number {
  const attackStrength = attackingTeam.attackRating / 100;
  const defenseStrength = defendingTeam.defenseRating / 100;
  const baseProbability = 0.3; // Base probability of scoring per shot on target

  const probability =
    baseProbability * (attackStrength / (attackStrength + defenseStrength));
  return Math.min(Math.max(probability, 0), 1); // Ensure between 0 and 1
}

// Helper functions for random variables
function poissonRandomVariable(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function binomialRandomVariable(trials: number, probability: number): number {
  let successes = 0;
  for (let i = 0; i < trials; i++) {
    if (Math.random() < probability) successes++;
  }
  return successes;
}

// Create teams with 11 random players
const teamA: Team = createRandomTeam("Team A");
const teamB: Team = createRandomTeam("Team B");

// Run the simulation
const [teamAStats, teamBStats] = simulateMatch(teamA, teamB);

// Output the results
console.log(`${teamA.name} Statistics:`, teamAStats);
console.log(`${teamB.name} Statistics:`, teamBStats);
