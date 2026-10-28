import { Movie, CastMember, CrewMember, LeaderboardEntry, MovieROIEntry } from '../types';

export interface DetailedMovieData {
  movie: Movie;
  cast: CastMember[];
  crew: CrewMember[];
}

export const MOCK_MOVIES: Record<number, DetailedMovieData> = {
  872585: {
    movie: {
      id: 872585,
      title: "Oppenheimer",
      overview: "The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.",
      poster_path: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/w1280/rLb2cw69Pazuxaj0sRXQ037tGI1.jpg",
      release_date: "2023-07-19",
      vote_average: 8.1
    },
    cast: [
      { id: 2037, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://image.tmdb.org/t/p/w185/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg", order: 0 },
      { id: 3223, name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3fq0lZMBv9779.jpg", order: 1 },
      { id: 5081, name: "Emily Blunt", character: "Katherine 'Kitty' Oppenheimer", profile_path: "https://image.tmdb.org/t/p/w185/nPJXaRMVUvgmn2SY8yQ65Z0aNfL.jpg", order: 2 },
      { id: 1892, name: "Matt Damon", character: "Leslie Groves", profile_path: "https://image.tmdb.org/t/p/w185/elSlNg0WqjSmFaSYLSpR3B39446.jpg", order: 3 },
      { id: 1373737, name: "Florence Pugh", character: "Jean Tatlock", profile_path: "https://image.tmdb.org/t/p/w185/750rEpBBo7ej244WqkhQ8A6Ur5P.jpg", order: 4 },
      { id: 17289, name: "Josh Hartnett", character: "Ernest Lawrence", profile_path: "https://image.tmdb.org/t/p/w185/dGoRLf7zK49w8i70w35vA9X3M.jpg", order: 5 }
    ],
    crew: [
      { id: 525, name: "Christopher Nolan", job: "Director", department: "Directing", profile_path: "https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg" },
      { id: 64670, name: "Ludwig Göransson", job: "Original Music Composer", department: "Sound", profile_path: "https://image.tmdb.org/t/p/w185/5c1kS017W4hT96U3yB6P9YtU5tU.jpg" },
      { id: 559, name: "Emma Thomas", job: "Producer", department: "Production", profile_path: "https://image.tmdb.org/t/p/w185/x2Z4D5XFz70S3mR6f0fO6R0Ew6y.jpg" }
    ]
  },
  579974: {
    movie: {
      id: 579974,
      title: "RRR",
      overview: "A fictional history of two legendary revolutionaries and their journey away from home before they began fighting for their country in the 1920s.",
      poster_path: "https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0ye2fq0SZ.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/w1280/fOy2Jurz9k62vsTALtmx28UCift.jpg",
      release_date: "2022-03-24",
      vote_average: 7.8
    },
    cast: [
      { id: 148037, name: "N.T. Rama Rao Jr.", character: "Komaram Bheem", profile_path: "https://image.tmdb.org/t/p/w185/5ycQgZ3SPUa12bq0yn1jpToBq9X.jpg", order: 0 },
      { id: 124314, name: "Ram Charan", character: "Alluri Sitarama Raju", profile_path: "https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg", order: 1 },
      { id: 1108120, name: "Alia Bhatt", character: "Sita", profile_path: "https://image.tmdb.org/t/p/w185/mB1T3M8P2Wk5a1N6V0bX0Q2y6aA.jpg", order: 2 },
      { id: 85034, name: "Ajay Devgn", character: "Venkata Rama Raju", profile_path: "https://image.tmdb.org/t/p/w185/jtW0z5ZqQ4o6pY0y6bU9X0Z8e9D.jpg", order: 3 }
    ],
    crew: [
      { id: 147021, name: "S. S. Rajamouli", job: "Director", department: "Directing", profile_path: "https://image.tmdb.org/t/p/w185/qPskSZxvoYflC8Bye4tGNBSroy5.jpg" },
      { id: 225318, name: "M. M. Keeravani", job: "Original Music Composer", department: "Sound", profile_path: "https://image.tmdb.org/t/p/w185/r0f7RTGIkG0ZBaQViIKrE1g82Ec.jpg" },
      { id: 2262705, name: "D. V. V. Danayya", job: "Producer", department: "Production", profile_path: null }
    ]
  },
  693134: {
    movie: {
      id: 693134,
      title: "Dune: Part Two",
      overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      poster_path: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
      release_date: "2024-02-27",
      vote_average: 8.2
    },
    cast: [
      { id: 1190668, name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg", order: 0 },
      { id: 505710, name: "Zendaya", character: "Chani", profile_path: "https://image.tmdb.org/t/p/w185/r3A7ev7Qkjvuh0bGeGqp0T60L16.jpg", order: 1 },
      { id: 932967, name: "Rebecca Ferguson", character: "Lady Jessica", profile_path: "https://image.tmdb.org/t/p/w185/hwhg6p4P8e7o7c0X8d0d5U8f4qT.jpg", order: 2 },
      { id: 139197, name: "Austin Butler", character: "Feyd-Rautha", profile_path: "https://image.tmdb.org/t/p/w185/2c68w8hP0a0gT5j8vV1Y6X4p9nQ.jpg", order: 3 }
    ],
    crew: [
      { id: 137427, name: "Denis Villeneuve", job: "Director", department: "Directing", profile_path: "https://image.tmdb.org/t/p/w185/xzQYqb4nR8xT7Zdw5itbEL9K3fd.jpg" },
      { id: 947, name: "Hans Zimmer", job: "Original Music Composer", department: "Sound", profile_path: "https://image.tmdb.org/t/p/w185/tpQnDeHY15szIXvpnhlprufz4d.jpg" },
      { id: 114404, name: "Mary Parent", job: "Producer", department: "Production", profile_path: null }
    ]
  },
  872906: {
    movie: {
      id: 872906,
      title: "Jawan",
      overview: "An emotional journey of a prison warden driven by a personal vendetta to rectify the corrupt wrongs in society.",
      poster_path: "https://image.tmdb.org/t/p/w500/jFt1g94utjj2YKQioVJTYWzOuvZ.jpg",
      backdrop_path: "https://image.tmdb.org/t/p/w1280/t5zCBSNVWjhjsIP2xFRSNqNIZJY.jpg",
      release_date: "2023-09-07",
      vote_average: 7.2
    },
    cast: [
      { id: 35742, name: "Shah Rukh Khan", character: "Vikram Rathore / Azad", profile_path: "https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg", order: 0 },
      { id: 139634, name: "Nayanthara", character: "Narmada Rai", profile_path: null, order: 1 },
      { id: 1269387, name: "Vijay Sethupathi", character: "Kalee Gaikwad", profile_path: null, order: 2 },
      { id: 139635, name: "Deepika Padukone", character: "Aishwarya Rathore", profile_path: null, order: 3 }
    ],
    crew: [
      { id: 1259367, name: "Atlee", job: "Director", department: "Directing", profile_path: null },
      { id: 1081464, name: "Anirudh Ravichander", job: "Original Music Composer", department: "Sound", profile_path: "https://image.tmdb.org/t/p/w185/xKvlrZpRaXkm2K2ZiXpqgrEedUU.jpg" },
      { id: 1108121, name: "Gauri Khan", job: "Producer", department: "Production", profile_path: null }
    ]
  }
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "dir-nolan",
    name: "Christopher Nolan",
    role: "Director",
    profilePath: "https://image.tmdb.org/t/p/w185/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",
    totalVotes: 12450,
    avgPercentage: 38.4,
    avgAmountRupees: 57.6,
    topMovieTitle: "Oppenheimer",
    filmsCount: 3,
    filmography: [
      { movieTitle: "Oppenheimer", avgPercentage: 38.4, voteCount: 5200 },
      { movieTitle: "Interstellar", avgPercentage: 36.2, voteCount: 4100 },
      { movieTitle: "The Dark Knight", avgPercentage: 40.5, voteCount: 3150 }
    ]
  },
  {
    id: "dir-rajamouli",
    name: "S. S. Rajamouli",
    role: "Director",
    profilePath: "https://image.tmdb.org/t/p/w185/qPskSZxvoYflC8Bye4tGNBSroy5.jpg",
    totalVotes: 9840,
    avgPercentage: 37.1,
    avgAmountRupees: 55.6,
    topMovieTitle: "RRR",
    filmsCount: 3,
    filmography: [
      { movieTitle: "RRR", avgPercentage: 37.1, voteCount: 4200 },
      { movieTitle: "Baahubali 2", avgPercentage: 39.5, voteCount: 3400 },
      { movieTitle: "Baahubali 1", avgPercentage: 35.8, voteCount: 2240 }
    ]
  },
  {
    id: "dir-denis",
    name: "Denis Villeneuve",
    role: "Director",
    profilePath: "https://image.tmdb.org/t/p/w185/xzQYqb4nR8xT7Zdw5itbEL9K3fd.jpg",
    totalVotes: 7350,
    avgPercentage: 34.8,
    avgAmountRupees: 52.2,
    topMovieTitle: "Dune: Part Two",
    filmsCount: 3,
    filmography: [
      { movieTitle: "Dune: Part Two", avgPercentage: 34.8, voteCount: 3850 },
      { movieTitle: "Blade Runner 2049", avgPercentage: 36.0, voteCount: 2100 },
      { movieTitle: "Arrival", avgPercentage: 33.2, voteCount: 1400 }
    ]
  },
  {
    id: "actor-srk",
    name: "Shah Rukh Khan",
    role: "Actor",
    profilePath: "https://image.tmdb.org/t/p/w185/tKeQhSyXyzlzxNtxFq24iIvzXrC.jpg",
    totalVotes: 14890,
    avgPercentage: 42.5,
    avgAmountRupees: 63.7,
    topMovieTitle: "Jawan",
    filmsCount: 3,
    filmography: [
      { movieTitle: "Jawan", avgPercentage: 42.5, voteCount: 6200 },
      { movieTitle: "Pathaan", avgPercentage: 39.2, voteCount: 5100 },
      { movieTitle: "Dunki", avgPercentage: 35.0, voteCount: 3590 }
    ]
  },
  {
    id: "actor-cillian",
    name: "Cillian Murphy",
    role: "Actor",
    profilePath: "https://image.tmdb.org/t/p/w185/2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg",
    totalVotes: 8400,
    avgPercentage: 32.6,
    avgAmountRupees: 48.9,
    topMovieTitle: "Oppenheimer",
    filmsCount: 3,
    filmography: [
      { movieTitle: "Oppenheimer", avgPercentage: 32.6, voteCount: 5200 },
      { movieTitle: "Inception", avgPercentage: 18.5, voteCount: 2100 },
      { movieTitle: "Dunkirk", avgPercentage: 16.2, voteCount: 1100 }
    ]
  },
  {
    id: "actor-ntr",
    name: "N.T. Rama Rao Jr.",
    role: "Actor",
    profilePath: "https://image.tmdb.org/t/p/w185/5ycQgZ3SPUa12bq0yn1jpToBq9X.jpg",
    totalVotes: 7150,
    avgPercentage: 31.8,
    avgAmountRupees: 47.7,
    topMovieTitle: "RRR",
    filmsCount: 2,
    filmography: [
      { movieTitle: "RRR", avgPercentage: 31.8, voteCount: 4200 },
      { movieTitle: "Devara: Part 1", avgPercentage: 38.5, voteCount: 2950 }
    ]
  },
  {
    id: "music-anirudh",
    name: "Anirudh Ravichander",
    role: "Music",
    profilePath: "https://image.tmdb.org/t/p/w185/xKvlrZpRaXkm2K2ZiXpqgrEedUU.jpg",
    totalVotes: 11200,
    avgPercentage: 26.4,
    avgAmountRupees: 39.6,
    topMovieTitle: "Jawan",
    filmsCount: 3,
    filmography: [
      { movieTitle: "Jawan", avgPercentage: 26.4, voteCount: 5200 },
      { movieTitle: "Leo", avgPercentage: 29.5, voteCount: 3800 },
      { movieTitle: "Jailer", avgPercentage: 31.2, voteCount: 2200 }
    ]
  },
  {
    id: "music-zimmer",
    name: "Hans Zimmer",
    role: "Music",
    profilePath: "https://image.tmdb.org/t/p/w185/tpQnDeHY15szIXvpnhlprufz4d.jpg",
    totalVotes: 9850,
    avgPercentage: 24.2,
    avgAmountRupees: 36.3,
    topMovieTitle: "Dune: Part Two",
    filmsCount: 3,
    filmography: [
      { movieTitle: "Dune: Part Two", avgPercentage: 24.2, voteCount: 4100 },
      { movieTitle: "Interstellar", avgPercentage: 28.6, voteCount: 3450 },
      { movieTitle: "Inception", avgPercentage: 25.1, voteCount: 2300 }
    ]
  },
  {
    id: "music-keeravani",
    name: "M. M. Keeravani",
    role: "Music",
    profilePath: "https://image.tmdb.org/t/p/w185/r0f7RTGIkG0ZBaQViIKrE1g82Ec.jpg",
    totalVotes: 6890,
    avgPercentage: 23.5,
    avgAmountRupees: 35.2,
    topMovieTitle: "RRR",
    filmsCount: 2,
    filmography: [
      { movieTitle: "RRR", avgPercentage: 23.5, voteCount: 4200 },
      { movieTitle: "Baahubali 2", avgPercentage: 25.8, voteCount: 2690 }
    ]
  }
];

export const INITIAL_MOVIE_ROIS: MovieROIEntry[] = [
  {
    movieId: 872585,
    title: "Oppenheimer",
    posterPath: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    totalVotes: 3420,
    avgAudienceSatisfaction: 24.5,
    dominantRole: "Director Led (Nolan 38.4%)",
    valueScore: 8.8
  },
  {
    movieId: 693134,
    title: "Dune: Part Two",
    posterPath: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    totalVotes: 2150,
    avgAudienceSatisfaction: 22.8,
    dominantRole: "Audiovisual Spectacle",
    valueScore: 8.6
  },
  {
    movieId: 579974,
    title: "RRR",
    posterPath: "https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0ye2fq0SZ.jpg",
    totalVotes: 2890,
    avgAudienceSatisfaction: 26.2,
    dominantRole: "Director & Action Led",
    valueScore: 8.9
  },
  {
    movieId: 872906,
    title: "Jawan",
    posterPath: "https://image.tmdb.org/t/p/w500/jFt1g94utjj2YKQioVJTYWzOuvZ.jpg",
    totalVotes: 4120,
    avgAudienceSatisfaction: 18.9,
    dominantRole: "Star Driven (SRK 42.5%)",
    valueScore: 7.9
  }
];
