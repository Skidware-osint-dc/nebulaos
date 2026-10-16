
function translateImageUrl(oldUrl) {
  if (!oldUrl) return '';

  if (oldUrl.includes('https://testingcf.jsdelivr.net/gh/')) {
    return oldUrl;
  }

  
  const filename = oldUrl.split('/').pop();

  
  return `https://testingcf.jsdelivr.net/gh/aDiesmos/images/${filename}`;
  
  return `https://testingcf.jsdelivr.net/gh/aDiesmos/images/${filename}`;
}

function logToClicky(gameName) {
  if (typeof clicky !== "undefined") {
    clicky.log(gameName, "game_click");
  }
}

function translateGameUrl(oldUrl) {
  if (!oldUrl) return '';
  
  
  if (oldUrl.includes('/gba/')) {
    const gameMatch = oldUrl.match(/player\.html\?game=([^&]+)/);
    if (gameMatch && gameMatch[1]) {
      const gameName = gameMatch[1];
      
      return `https://testingcf.jsdelivr.net/gh/aDiesmos/gba/${gameName}`;
      return `https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/${gameName}`;
    }
  }
  
  
  if (oldUrl.includes('')) {
    const urlMatch = oldUrl.match(/player\.html\?game=(.+)/);
    if (urlMatch && urlMatch[1]) {
      const gameUrl = decodeURIComponent(urlMatch[1]);
      return extractGamePath(gameUrl);
    }
  }
  
  
  return extractGamePath(oldUrl);
}

function extractGamePath(fullUrl) {
 
  if (fullUrl.includes('https://testingcf.jsdelivr.net/gh/')) {
    return fullUrl;
  }
  
  
  let path = fullUrl;
  
  
  if (path.includes('https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/')) {
    path = path.replace('https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/', '');
  }
  
  
  path = path.replace(/\/$/, '');
  
  
  const parts = path.split('/');
  if (parts.length < 1) return '';
  
 
  if (parts.length === 1) {
    const gameName = parts[0];
    return `https://testingcf.jsdelivr.net/gh/aDiesmos//${gameName}.html`;
    return `https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/aDiesmos/${gameName}.html`;
  }
  
  const urlPath = parts.slice(0, -1).join('/');
  const gameName = parts.pop();
  
  
  return `https://testingcf.jsdelivr.net/gh/aDiesmos/${urlPath}/${gameName}.html`;
  return `https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/${urlPath}/${gameName}.html`;
}


const games = [
   {
    id: 1,
    title: "Anti Terrorist Rush",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/anti-terrorist-rush.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/anti-terrorist-rush.html",
    isNew: false
  },
  {
    id: 2,
    title: "Bad Ice Cream 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bad-ice-cream-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bad-ice-cream-2.html",
    isNew: false
  },
  {
    id: 3,
    title: "Bad Ice Cream 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bad-ice-cream-3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bad-ice-cream-3.html",
    isNew: false
  },
  {
    id: 4,
    title: "Bad Ice Cream",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bad-ice-cream.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bad-ice-cream.html",
    isNew: false
  },
  {
    id: 6,
    title: "Cat Connection",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/catconnection.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/catconnection.html",
    isNew: false
  },
  {
    id: 7,
    title: "Douchebag Workout 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/douchebag-workout-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/douchebag-workout-2.html",
    isNew: false
  },
  {
    id: 8,
    title: "Froggys Battle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/froggys-battle.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/froggys-battle.html",
    isNew: false
  },
  {
    id: 9,
    title: "Gimme The Airpod",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gimme-the-airpod.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/gimme-the-airpod.html",
    isNew: false
  },
  {
    id: 10,
    title: "an average day at the cat cafe",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/catcafe.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/catcafe.html",
    isNew: false
  },
  {
    id: 11,
    title: "Helios",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/helios.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/helios.html",
    isNew: false
  },
  {
    id: 12,
    title: "Matrix Rampage",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/matrixrampage.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/matrixrampage.html",
    isNew: false
  },
  {
    id: 13,
    title: "SpongeBob SquarePants: Bubble Blast",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bubble-blast.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/bubble-blast.html",
    isNew: false
  },
  {
    id: 14,
    title: "2048 Merge Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/2048-merge-run.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/2048-merge-run.html",
    isNew: false
  },
  {
    id: 15,
    title: "Build a Big Army",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/build-a-big-army.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/build-a-big-army.html",
    isNew: false
  },
  {
    id: 16,
    title: "1010 Deluxe",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/1010deluxe.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/schol/1010deluxe.html",
    isNew: false
  },
  {
    id: 17,
    title: "3 Pandas",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/build-a-big-army.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/schol/3pandas.html",
    isNew: false
  },
  {
    id: 18,
    title: "Hoop Royale",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/HoopRoyale-gh-pages.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/schol/HoopRoyale-gh-pages.html",
    isNew: false
  },
  {
    id: 19,
    title: "Boxing Random",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/boxingrandom.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/schol/boxingrandom.html",
    isNew: false
  },
  {
    id: 20,
    title: "Bubble Tower 3d",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bubbletower3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/schol/bubbletower3d.html",
    isNew: false
  },
  {
    id: 21,
    title: "Build a Plane",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/build-a-plane.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/build-a-plane.html",
    isNew: false
  },
  {
    id: 22,
    title: "Camouflage and Sniper",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/camouflage-and-sniper.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/camouflage-and-sniper.html",
    isNew: false
  },
  {
    id: 23,
    title: "Car Survival 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/car-survival-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/car-survival-3d.html",
    isNew: false
  },
  {
    id: 24,
    title: "City Defense",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/city-defense.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/city-defense.html",
    isNew: false
  },
  {
    id: 25,
    title: "Clothing Shop 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/clothing-shop-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/clothing-shop-3d.html",
    isNew: false
  },
  {
    id: 26,
    title: "Cool Cars Run 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cool-cars-run-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/cool-cars-run-3d.html",
    isNew: false
  },
  {
    id: 27,
    title: "Crush Cars 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/crush-cars-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/crush-cars-3d.html",
    isNew: false
  },
  {
    id: 28,
    title: "Scarlet Shift",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/scarletshift.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/schol/scarletshift.html",
    isNew: false
  },
  {
    id: 29,
    title: "The Final Cat",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/finalcat.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/schol/finalcat.html",
    isNew: false
  },
  {
    id: 30,
    title: "Renegade Rally",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/renegaderally.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/schol/renegaderally.html",
    isNew: false
  },
  {
    id: 31,
    title: "Destroy the Car 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/destroy-the-car-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/destroy-the-car-3d.html",
    isNew: false
  },
  {
    id: 32,
    title: "Wild Kratts: Archerfish Bug Rush",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/archerfish-bug-rush.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/archerfish-bug-rush.html",
    isNew: false
  },
  {
    id: 33,
    title: "Wild Kratts: Creature Mobile",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/creature-mobile.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/creature-mobile.html",
    isNew: false
  },
  {
    id: 34,
    title: "Bendy and the Ink Machine",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bendy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/vendors/bendy.html",
    isNew: false
  },
  {
    id: 35,
    title: "Yandere Simulator",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/yandere-simulator.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/yandere-simulator.html",
    isNew: false
  },
  {
    id: 36,
    title: "FNF: CN Lost Episodes",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cnlost.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/cnlost.html",
    isNew: false
  },
  {
    id: 37,
    title: "FNF: Sweet Licorice",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/licorice.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/licorice.html",
    isNew: false
  },
  {
    id: 38,
    title: "FNF: Porifera Atoll",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/porifera.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/porifera.html",
    isNew: false
  },
  {
    id: 39,
    title: "FNF: Tails Gets Trolled",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tailstroll.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/tailstroll.html",
    isNew: false
  },
  {
    id: 40,
    title: "FNF: ATROCITY 2025",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/atrocity.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/atrocity.html",
    isNew: false
  },
  {
    id: 41,
    title: "FNF: Chev (V-Slice One Shot)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chev.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/chev.html",
    isNew: false
  },
  {
    id: 42,
    title: "Wild Kratts: Monkey Mayhem",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/monkey-mayhem.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/monkey-mayhem.html",
    isNew: false
  },
  {
    id: 43,
    title: "Wild Kratts: Amazin' Amazon Adventure",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/amazin-amazon-adventure.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/amazin-amazon-adventure.html",
    isNew: false
  },
  {
    id: 44,
    title: "Super Mario Micro Land",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/super-mario-micro-land.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/super-mario-micro-land.html",
    isNew: false
  },
  {
    id: 45,
    title: "Diamond Seeker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/diamond-seeker.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/diamond-seeker.html",
    isNew: false
  },
  {
    id: 46,
    title: "Draw Joust",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/draw-joust.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/draw-joust.html",
    isNew: false
  },
  {
    id: 47,
    title: "Evolving Bombs 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/evolving-bombs-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/evolving-bombs-3d.html",
    isNew: false
  },
  {
    id: 48,
    title: "Fire and Frost Master",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fire-and-frost-master.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/fire-and-frost-master.html",
    isNew: false
  },
  {
    id: 49,
    title: "Fitness Empire",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fitness-empire.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/fitness-empire.html",
    isNew: false
  },
  {
    id: 50,
    title: "SpongeBob SquarePants: Land Ho!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob-landho.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spongebob-landho.html",
    isNew: false
  },
  {
    id: 51,
    title: "SpongeBob SquarePants: SpongeBob Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob-run.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spongebob-run/.html",
    isNew: false
  },
  {
    id: 52,
    title: "Mario Party Advance",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/marioparty.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/marioparty.html",
    isNew: false
  },
  {
    id: 53,
    title: "WarioWare, Inc.",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/wario_ware.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/wario_ware.html",
    isNew: false
  },
  {
    id: 54,
    title: "The Legend of Zelda: A Link to the Past",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/zelda_past.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/zelda_past.html",
    isNew: false
  },
  {
    id: 55,
    title: "Final Fantasy 1 & 2 Advance",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ff1and2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/ff1and2.html",
    isNew: false
  },
  {
    id: 56,
    title: "Final Fantasy IV Advance (Sound Restoration Mod)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ff4S.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/ff4S.html",
    isNew: false
  },
  {
    id: 57,
    title: "Final Fantasy VI Advance",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ff6.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/ff6.html",
    isNew: false
  },
  {
    id: 58,
    title: "Final Fantasy Tactics Advance",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/final_fantasy_tactics.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/final_fantasy_tactics.html",
    isNew: false
  },
  {
    id: 59,
    title: "Fire Emblem",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fire_emblem.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/fire_emblem.html",
    isNew: false
  },
  {
    id: 60,
    title: "Digimon Racing",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/digimon_racing.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/digimon_racing.html",
    isNew: false
  },
  {
    id: 61,
    title: "The Legend of Zelda: The Minish Cap",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/zelda_minish.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/zelda_minish.html",
    isNew: false
  },
  {
    id: 62,
    title: "Bomberman Max 2 - Blue Advance",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bomberman_max2blue.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/bomberman_max2blue.html",
    isNew: false
  },
  {
    id: 63,
    title: "Bomberman Tournament",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bomberman_tournament.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/bomberman_tournament.html",
    isNew: false
  },
  {
    id: 64,
    title: "Bubble Bobble: Old and New",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bubblebobble.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/bubblebobble.html",
    isNew: false
  },
  {
    id: 65,
    title: "F-Zero - GP Legend",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fzero_gp.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/fzero_gp.html",
    isNew: false
  },
  {
    id: 66,
    title: "F-Zero - Maximum Velocity",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fzero_max.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/fzero_max.html",
    isNew: false
  },
  {
    id: 67,
    title: "Game & Watch Gallery 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gamewatch4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/gamewatch4.html",
    isNew: false
  },
  {
    id: 68,
    title: "Golden Sun",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/goldensun.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/goldensun.html",
    isNew: false
  },
  {
    id: 69,
    title: "Gunstar Super Heroes",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gunstar_super_heroes.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/gunstar_super_heroes.html",
    isNew: false
  },
  {
    id: 70,
    title: "Hamtaro - Ham-Ham Heartbreak",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hamtaro_heartbreak.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/hamtaro_heartbreak.html",
    isNew: false
  },
  {
    id: 71,
    title: "Iridion 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/iridion.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/iridion.html",
    isNew: false
  },
  {
    id: 72,
    title: "Kirby & The Amazing Mirror",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kirbymirror.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/kirbymirror.html",
    isNew: false
  },
  {
    id: 73,
    title: "Kirby: Nightmare in Dream Land",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kirbynightmare.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/kirbynightmare.html",
    isNew: false
  },
  {
    id: 74,
    title: "The Amazing World of Gumball: Disc Duel",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/discduel.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/discduel.html",
    isNew: false
  },
  {
    id: 75,
    title: "The Amazing World of Gumball: Swing Out",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/swingout.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/swingout.html",
    isNew: false
  },
  {
    id: 76,
    title: "The Amazing World of Gumball: Remote Fu",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/remotefu.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/remotefu.html",
    isNew: false
  },
  {
    id: 77,
    title: "The Amazing World of Gumball: Snow Stoppers",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/snowstoppers.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/snowstoppers.html",
    isNew: false
  },
  {
    id: 78,
    title: "The Amazing World of Gumball: Water Sons",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/watersons.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/watersons.html",
    isNew: false
  },
  {
    id: 79,
    title: "SpongeBob SquarePants: Squidward's Sizzlin' Scare",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob-sizzle.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spongebob-sizzle.html",
    isNew: false
  },
  {
    id: 80,
    title: "SpongeBob SquarePants: Sandy's Sponge Stacker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob-stacker.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spongebob-stacker.html",
    isNew: false
  },
  {
    id: 81,
    title: "SpongeBob SquarePants: Tasty Pastry Party",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob-tasty.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spongebob-tasty.html",
    isNew: false
  },
  {
    id: 82,
    title: "SpongeBob SquarePants: The Kah-Ray-Tay Squid",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob-thekahrahtaysquid.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spongebob-thekahrahtaysquid.html",
    isNew: false
  },
  {
    id: 83,
    title: "HACHAMECHA MARCHEN",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hachamecha.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/hachamecha.html",
    isNew: false
  },
  {
    id: 84,
    title: "PortaBoy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/portaboy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/portaboy.html",
    isNew: false
  },
  {
    id: 85,
    title: "Oshi Oshi Punch!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/oshi-oshi-punch.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/oshi-oshi-punch.html",
    isNew: false
  },
  {
    id: 86,
    title: "Bad Monday Simulator",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bad-monday-simulator.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/bad-monday-simulator.html",
    isNew: false
  },
  {
    id: 87,
    title: "Human Expenditure Program (BLOODMONEY! 2)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/human-expenditure-program.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/human-expenditure-program.html",
    isNew: false
  },
  {
    id: 88,
    title: "DOKI BOOM DASH!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dokiboomdash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/dokiboomdash.html",
    isNew: false
  },
  {
    id: 89,
    title: "kana.exe",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kanaexe.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/kanaexe.html",
    isNew: false
  },
  {
    id: 90,
    title: "Neo Malta",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/neomalta.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/neomalta.html",
    isNew: false
  },
  {
    id: 91,
    title: "let's hide the body!♡ (tee-hee~)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hidethebody.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/hidethebody.html",
    isNew: false
  },
  {
    id: 92,
    title: "SpongeBob SquarePants: WereSquirrel",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob-weresquirrel.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spongebob-weresquirrel.html",
    isNew: false
  },
  {
    id: 93,
    title: "SpongeBob SquarePants: Krabby Katch",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/krabbykatch.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/krabbykatch.html",
    isNew: false
  },
  {
    id: 94,
    title: "Flick Goal",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/flick-goal.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/flick-goal.html",
    isNew: false
  },
  {
    id: 95,
    title: "Flip Master",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/flip-master.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/flip-master.html",
    isNew: false
  },
  {
    id: 96,
    title: "Giant Wanted",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/giant-wanted.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/giant-wanted.html",
    isNew: false
  },
  {
    id: 97,
    title: "Gun Clone",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gun-clone.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/gun-clone.html",
    isNew: false
  },
  {
    id: 98,
    title: "Gun Runner",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gun-runner.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/gun-runner.html",
    isNew: false
  },
  {
    id: 99,
    title: "High Heels",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/high-heels.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/high-heels.html",
    isNew: false
  },
  {
    id: 100,
    title: "Kaji Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kaji-run.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/kaji-run.html",
    isNew: false
  },
  {
    id: 101,
    title: "Make a Superboat",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/make-a-superboat.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/make-a-superboat.html",
    isNew: false
  },
  {
    id: 102,
    title: "Makeover Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/makeover-run.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/makeover-run.html",
    isNew: false
  },
  {
    id: 103,
    title: "Mega Car Jumps",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mega-car-jumps.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/mega-car-jumps.html",
    isNew: false
  },
  {
    id: 104,
    title: "Money Rush",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/money-rush.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/money-rush.html",
    isNew: false
  },
  {
    id: 105,
    title: "Monster Box 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/monster-box-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/monster-box-3d.html",
    isNew: false
  },
  {
    id: 106,
    title: "Office Fight",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/office-fight.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/office-fight.html",
    isNew: false
  },
  {
    id: 107,
    title: "Robot Invasion",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/robot-invasion.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/robot-invasion.html",
    isNew: false
  },
  {
    id: 108,
    title: "Run Rich 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/run-rich-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/run-rich-3d.html",
    isNew: false
  },
  {
    id: 109,
    title: "Save P Diddy From Prison",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/save-p-diddy-from-prison.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/save-p-diddy-from-prison.html",
    isNew: false
  },
  {
    id: 110,
    title: "Seat Jam 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/seat-jam-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/seat-jam-3d.html",
    isNew: false
  },
  {
    id: 111,
    title: "Shooting Master",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/shooting-master.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/shooting-master.html",
    isNew: false
  },
  {
    id: 112,
    title: "Supermarket 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/supermarket-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/supermarket-3d.html",
    isNew: false
  },
  {
    id: 113,
    title: "Survive to Victory",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/survive-to-victory.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/survive-to-victory.html",
    isNew: false
  },
  {
    id: 114,
    title: "Telekinesis Attack",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/telekinesis-attack.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/telekinesis-attack.html",
    isNew: false
  },
  {
    id: 115,
    title: "Telekinesis Car",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/telekinesis-car.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/telekinesis-car.html",
    isNew: false
  },
  {
    id: 116,
    title: "Telekinesis Drive",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/telekinesis-drive.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/telekinesis-drive.html",
    isNew: false
  },
  {
    id: 117,
    title: "Telekinesis",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/telekinesis.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/telekinesis.html",
    isNew: false
  },
  {
    id: 118,
    title: "Triple Match 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/triple-match-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/triple-match-3d.html",
    isNew: false
  },
  {
    id: 119,
    title: "Tug of War With Cars",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tug-of-war-with-cars.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/tug-of-war-with-cars.html",
    isNew: false
  },
  {
    id: 120,
    title: "Twerk Race 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/twerk-race-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/twerk-race-3d.html",
    isNew: false
  },
  {
    id: 121,
    title: "Twisted Rope 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/twisted-rope-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/twisted-rope-3d.html",
    isNew: false
  },
  {
    id: 122,
    title: "Wall Crawler",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/wall-crawler.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/wall-crawler.html",
    isNew: false
  },
  {
    id: 123,
    title: "War Regions",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/war-regions.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/war-regions.html",
    isNew: false
  },
  {
    id: 124,
    title: "Weapon Craft Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/weapon-craft-run.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/weapon-craft-run.html",
    isNew: false
  },
  {
    id: 125,
    title: "Weapon Upgrade Rush",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/weapon-upgrade-rush.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/weapon-upgrade-rush.html",
    isNew: false
  },
  {
    id: 126,
    title: "Wheel Scale",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/wheel-scale.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/brainrot/wheel-scale.html",
    isNew: false
  },
  {
    id: 127,
    title: "Class of '09: The Re-Up",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/re-up.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gamepath/re-up.html",
    isNew: false
  },
  {
    id: 128,
    title: "Pixel Cave",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pixel-cave.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/pixel-cave.html",
    isNew: false
  },
  {
    id: 129,
    title: "Push The Square",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/push-the-square.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/push-the-square.html",
    isNew: false
  },
  {
    id: 130,
    title: "Slope Ball",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/slope-ball.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/slope-ball.html",
    isNew: false
  },
  {
    id: 131,
    title: "Slope 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/slope2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/slope2.html",
    isNew: false
  },
  {
    id: 132,
    title: "Jelly Well",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/jelly-well.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/jellywell.html",
    isNew: false
  },
  {
    id: 133,
    title: "SpongeBob SquarePants: Marble Bash",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/marble-bash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/marble-bash.html",
    isNew: false
  },
  {
    id: 134,
    title: "Sonic The Hedgehog 2: Community's Cut",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sonic2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/sonic2.html",
    isNew: false
  },
  {
    id: 135,
    title: "Sonic The Hedgehog 3: Angel Island Revisited",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sonic3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/sonic3/sonic3air_web.html",
    isNew: false
  },
  {
    id: 136,
    title: "SpongeBob SquarePants: Monster Island",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob-monster-island.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/spongebob-monster-island.html",
    isNew: false
  },
  {
    id: 137,
    title: "SpongeBob SquarePants: Cardbored",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob-squarepants-cardbored.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/assets/spongebob-squarepants-cardbored.html",
    isNew: false
  },
  {
    id: 138,
    title: "Packabunchas",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/packabunchas.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/packabunchas.html",
    isNew: false
  },
  {
    id: 139,
    title: "Papas Sushiria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/papas-sushiria.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/papas-sushiria.html",
    isNew: false
  },
  {
    id: 140,
    title: "Infernae",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/infernae.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/infernae.html",
    isNew: false
  },
  {
    id: 141,
    title: "Kart Kingdom Racing",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kartkingdom.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/kartkingdom.html",
    isNew: false
  },
  {
    id: 142,
    title: "I woke up next to you again.",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/nextyou.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/nextyou.html",
    isNew: false
  },
  {
    id: 143,
    title: "Pinball Mania",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pinballmania.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/pinballmania.html",
    isNew: false
  },
  {
    id: 144,
    title: "Super Zombies Again",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/superzombie.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/superzombie.html",
    isNew: false
  },
  {
    id: 145,
    title: "UNDERWHEELS",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/underwheels.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/underwheels.html",
    isNew: false
  },
  {
    id: 146,
    title: "Squid Gun Fest",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/SquidGunFest.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/SquidGunFest.html",
    isNew: false
  },
  {
    id: 147,
    title: "Space Company",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/space-company.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/space-company.html",
    isNew: false
  },
  {
    id: 148,
    title: "Space Garden",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spacegarden.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spacegarden.html",
    isNew: false
  },
  {
    id: 149,
    title: "Stickman Epic Battle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/stickman-epic-battle.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/stickman-epic-battlev",
    isNew: false
  },
  {
    id: 150,
    title: "Storm The House2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/stormthehouse2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/stormthehouse2.html",
    isNew: false
  },
  {
    id: 151,
    title: "Tanuki Sunset",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tanuki-sunset.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/tanuki-sunset.html",
    isNew: false
  },
  {
    id: 153,
    title: "Go! Go! K.O.!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gogoko.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/gogoko.html",
    isNew: false
  },
  {
    id: 154,
    title: "groon groon, babey!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/groongroon.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/groongroon.html",
    isNew: false
  },
  {
    id: 155,
    title: "RigBMX",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rigbmx.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/rigbmx/rigbmx-en-290817.html",
    isNew: false
  },
  {
    id: 156,
    title: "RigBMX 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rigbmx2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/rigbmx2.html",
    isNew: false
  },
  {
    id: 157,
    title: "Slither.io Online",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/slitherio.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/slitherio.html",
    isNew: false
  },
  {
    id: 158,
    title: "The Race",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/therace.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/therace.html",
    isNew: false
  },
  {
    id: 159,
    title: "Tricolor",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tricolor.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/tricolor.html",
    isNew: false
  },
  {
    id: 160,
    title: "Jump Jousts",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/jumpjousts.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/jumpjousts.html",
    isNew: false
  },
  {
    id: 161,
    title: "Jump Jousts 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/jumpjousts2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/jumpjousts2.html",
    isNew: false
  },
  {
    id: 162,
    title: "Love Letters",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/love-letters.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/love-letters.html",
    isNew: false
  },
  {
    id: 163,
    title: "Parking Lot Wars",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/parkinglotwars.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/parkinglotwars.html",
    isNew: false
  },
  {
    id: 164,
    title: "Police Getaway",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/police.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/police.html",
    isNew: false
  },
  {
    id: 165,
    title: "Go! Slimey Go!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/slimey.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/slimey.html",
    isNew: false
  },
  {
    id: 166,
    title: "Your Turn To Die",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/yttd.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/yttd.html",
    isNew: false
  },
  {
    id: 167,
    title: "FNF: Kick Kick Funk!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kick.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/kick.html",
    isNew: false
  },
  {
    id: 168,
    title: "Dont Drop The White Ball 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dont-drop-the-white-ball-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/dont-drop-the-white-ball-2.html",
    isNew: false
  },
  {
    id: 169,
    title: "Generic Fishing Game",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/generic-fishing-game.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/generic-fishing-game.html",
    isNew: false
  },
  {
    id: 170,
    title: "Geometry Jump Sketchy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/geometry_jump_sketchy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/geometry_jump_sketchy.html",
    isNew: false
  },
  {
    id: 171,
    title: "Icy's Purple Head",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/icys-purple-head.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/icys-purple-head.html",
    isNew: false
  },
  {
    id: 172,
    title: "Interactive Buddy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/interactivebuddy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/interactivebuddy.html",
    isNew: false
  },
  {
    id: 173,
    title: "Jimothy Piggerton",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/jimothy-piggerton.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/jimothy-piggerton.html",
    isNew: false
  },
  {
    id: 175,
    title: "Swordfight",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/swordfight.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/swordfight.html",
    isNew: false
  },
  {
    id: 176,
    title: "Dude Theft Auto",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dudetheft.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/dudetheft.html",
    isNew: false
  },
  {
    id: 177,
    title: "Labubu Clicker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/labubu.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/labubu.html",
    isNew: false
  },
  {
    id: 178,
    title: "Class of 09'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/class09.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/class-of-09.html",
    isNew: false
  },
  {
    id: 179,
    title: "Ultrakill",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ultrakill.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/ultrakill.html",
    isNew: false
  },
  {
    id: 180,
    title: "BLOODMONEY!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bmoney.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bmoney.html",
    isNew: false
  },
  {
    id: 181,
    title: "Infinite Mario",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/infmar.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/infmar.html",
    isNew: false
  },
  {
    id: 182,
    title: "Hextris",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hxtrs.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/hxtrs.html",
    isNew: false
  },
  {
    id: 183,
    title: "Chiikawa Puzzle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chiipuz.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chiipuz.html",
    isNew: false
  },
  {
    id: 184,
    title: "Ovo 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ovo2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/ovo2.html",
    isNew: false
  },
  {
    id: 185,
    title: "Bubble Pop Adventures",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bubblepopadventures.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bubblepopadventures.html",
    isNew: false
  },
  {
    id: 186,
    title: "Head Soccer 2023",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/headsoccer2023.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/headsoccer2023.html",
    isNew: false
  },
  {
    id: 187,
    title: "3D Bowling",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/3dbowling.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/3dbowling.html",
    isNew: false
  },
  {
    id: 188,
    title: "Basket and Ball",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/basketandball.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/basketandball.html",
    isNew: false
  },
  {
    id: 189,
    title: "Block the Pig",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/blockthepig.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/blockthepig.html",
    isNew: false
  },
  {
    id: 190,
    title: "FNAF: Sister Location",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fnaf5.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/fnaf5.html",
    isNew: false
  },
  {
    id: 191,
    title: "Neon Leap",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/neon-leap.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/neon-leap.html",
    isNew: false
  },
  {
    id: 192,
    title: "Temple Run 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/temple-run-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/temple-run-2.html",
    isNew: false
  },
  {
    id: 193,
    title: "Winter Clash 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/winter-clash-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/winter-clash-3d.html",
    isNew: false
  },
  {
    id: 194,
    title: "Color Pencil Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/color-pencil-run.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/color-pencil-run.html",
    isNew: false
  },
  {
    id: 195,
    title: "People Playground",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/peopleplayground.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gamepath/people-playground.html",
    isNew: false
  },
  {
    id: 196,
    title: "Yume Nikki",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/yumenikki.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gamepath/yume-nikki.html",
    isNew: false
  },
  {
    id: 197,
    title: "Pure CSS Stack",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/stck.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/stck.html",
    isNew: false
  },
  {
    id: 198,
    title: "Phineas and Ferb Tetris",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pftet.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/bestgameevermadefrfrong.html",
    isNew: false
  },
  {
    id: 199,
    title: "Doki Doki Literature Club",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ddlc.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/dokidokiliteratureclub.html",
    isNew: false
  },
  {
    id: 200,
    title: "Undertale",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/undertalereal.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gamepath/undertale.html",
    isNew: false
  },
  {
    id: 201,
    title: "Deltarune",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/deltarune.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gamepath/deltarune.html",
    isNew: false
  },
  {
    id: 202,
    title: "FNF: an FNF Bocchi the Rock! mod (DEMO)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bocchi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/bocchi.html",
    isNew: false
  },
  {
    id: 203,
    title: "FNF: Weekend 1: Girlfriend Mix",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gfmixes.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/gfmix.html",
    isNew: false
  },
  {
    id: 204,
    title: "Lacey's Flash Games",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/lacey.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gamepath/lacysflashgames.html",
    isNew: false
  },
  {
    id: 205,
    title: "Do NOT Take This Cat Home",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dontcat.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gamepath/donottakethiscathome.html",
    isNew: false
  },
  {
    id: 206,
    title: "Papa louie",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/papalouie.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/papalouie.html",
    isNew: false
  },
  {
    id: 207,
    title: "Papa louie 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/papalouie2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/papalouie2.html",
    isNew: false
  },
  {
    id: 208,
    title: "Papa louie 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/papalouie3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/papalouie3.html",
    isNew: false
  },
  {
    id: 209,
    title: "Quest For Bacon",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bacon.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bacon.html",
    isNew: false
  },
  {
    id: 210,
    title: "Get To The Top Although There Is No Top BFDI",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gettotopbfdi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/gettotopbfdi.html",
    isNew: false
  },
  {
    id: 211,
    title: "Not So Special Stage",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/notsospecialstage.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/notsospecialstage.html",
    isNew: false
  },
  {
    id: 212,
    title: "100ng",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/100ng.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/100ng.html",
    isNew: false
  },
  {
    id: 213,
    title: "8Ball Billards Classic",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/8ball-billards-classic.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/8ball-billards-classic.html",
    isNew: false
  },
  {
    id: 214,
    title: "Snake",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/google-snake.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/google-snake.html",
    isNew: false
  },
  {
    id: 215,
    title: "Solitaire",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/google-solitaire.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/google-solitaire.html",
    isNew: false
  },
  {
    id: 216,
    title: "Arcade Wizard",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/arcade-wizard.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/arcade-wizard.html",
    isNew: false
  },
  {
    id: 217,
    title: "Black Hole Square",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/blackholesquare.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/blackholesquare.html",
    isNew: false
  },
  {
    id: 218,
    title: "Black Knight",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/blackknight.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/blackknight.html",
    isNew: false
  },
  {
    id: 219,
    title: "Bloons Tower Defense",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bloonstd.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bloonstd.html",
    isNew: false
  },
  {
    id: 220,
    title: "Bloons Tower Defense 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bloonstd2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bloonstd2.html",
    isNew: false
  },
  {
    id: 221,
    title: "Among Us",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/among-us.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/among-us.html",
    isNew: false
  },
  {
    id: 222,
    title: "Ascii Space",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/asciispace.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/asciispace.html",
    isNew: false
  },
  {
    id: 223,
    title: "Aspiring Artist",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/aspiring-artist.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/aspiring-artist.html",
    isNew: false
  },
  {
    id: 224,
    title: "Cannon Basketball 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cannon-basketball-4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/cannon-basketball-4.html",
    isNew: false
  },
  {
    id: 225,
    title: "Crowd City 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/crowd-city-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/crowd-city-2.html",
    isNew: false
  },
  {
    id: 226,
    title: "Defend The Tank",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/defend-the-tank.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/defend-the-tank.html",
    isNew: false
  },
  {
    id: 227,
    title: "Doctor Acorn 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/doctor-acorn2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/doctor-acorn2.html",
    isNew: false
  },
  {
    id: 228,
    title: "Double Wires",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/doublewires.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/doublewires.html",
    isNew: false
  },
  {
    id: 229,
    title: "Dragon Vs Bricks",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dragon-vs-bricks.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/dragon-vs-bricks.html",
    isNew: false
  },
  {
    id: 230,
    title: "Grey Box Testing",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/greybox.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/greybox.html",
    isNew: false
  },
  {
    id: 231,
    title: "Protektor",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/protektor.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/protektor.html",
    isNew: false
  },
  {
    id: 232,
    title: "Rocking Sky Trip",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rocking-sky-trip.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/rocking-sky-trip.html",
    isNew: false
  },
  {
    id: 233,
    title: "Smoking Barrels",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/smokingbarrels.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/smokingbarrels.html",
    isNew: false
  },
  {
    id: 234,
    title: "Winter Falling Price",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/winter-falling-price.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/winter-falling-price.html",
    isNew: false
  },
  {
    id: 235,
    title: "Battle For Gondor",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/battleforgondor.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/battleforgondor.html",
    isNew: false
  },
  {
    id: 236,
    title: "Connect 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/connect3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/connect3.html",
    isNew: false
  },
  {
    id: 237,
    title: "Craft Mine",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/craftmine.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/craftmine.html",
    isNew: false
  },
  {
    id: 238,
    title: "Doge Mining Simulator",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/doge-mining-simulator.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/doge-mining-simulator.html",
    isNew: false
  },
  {
    id: 239,
    title: "Flappy 2048",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/flappy-2048.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/flappy-2048.html",
    isNew: false
  },
  {
    id: 240,
    title: "Flappy Defense",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/flappy-defense.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/flappy-defense.html",
    isNew: false
  },
  {
    id: 241,
    title: "A Game Inside A Game",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/game-inside.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/game-inside.html",
    isNew: false
  },
  {
    id: 242,
    title: "Evil Glitch",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/evil-glitch.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/evil-glitch.html",
    isNew: false
  },
  {
    id: 243,
    title: "Hobo",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hobo.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/hobo.html",
    isNew: false
  },
  {
    id: 244,
    title: "Hobo 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hobo2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/hobo2.html",
    isNew: false
  },
  {
    id: 245,
    title: "Hobo 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hobo3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/hobo3.html",
    isNew: false
  },
  {
    id: 246,
    title: "Hobo 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hobo4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/hobo4.html",
    isNew: false
  },
  {
    id: 247,
    title: "Hobo 5",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hobo5.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/hobo5.html",
    isNew: false
  },
  {
    id: 248,
    title: "Hobo 6",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hobo6.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/hobo6.html",
    isNew: false
  },
  {
    id: 249,
    title: "Hobo 7",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hobo7.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/hobo7.html",
    isNew: false
  },
  {
    id: 250,
    title: "Rolling Forests",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rolling-forests.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/rolling-forests.html",
    isNew: false
  },
  {
    id: 251,
    title: "Shards",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/shards.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/shards.html",
    isNew: false
  },
  {
    id: 252,
    title: "Doge 2048",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/doge2048.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/doge2048.html",
    isNew: false
  },
  {
    id: 253,
    title: "Make It Meme",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/makeitmeme.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/makeitmeme.html",
    isNew: false
  },
  {
    id: 254,
    title: "Klocki",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/klocki.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/klocki.html",
    isNew: false
  },
  {
    id: 255,
    title: "Poly Branch",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/polybranch.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/polybranch.html",
    isNew: false
  },
  {
    id: 256,
    title: "Retro Haunt",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/retrohaunt.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/retrohaunt.html",
    isNew: false
  },
  {
    id: 257,
    title: "Backrooms",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/backrooms.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/backrooms.html",
    isNew: false
  },
  {
    id: 258,
    title: "Bounce Back",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bounceback.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bounceback.html",
    isNew: false
  },
  {
    id: 259,
    title: "Color Switch 2 Challenges",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/color-switch-2-challenges.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/color-switch-2-challenges.html",
    isNew: false
  },
  {
    id: 260,
    title: "Gun Spin",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gunspin.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/gunspin.html",
    isNew: false
  },
  {
    id: 261,
    title: "Shift Flash",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/shift-flash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/shift-flash.html",
    isNew: false
  },
  {
    id: 262,
    title: "Shift Flash 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/shift-flash-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/shift-flash-2.html",
    isNew: false
  },
  {
    id: 263,
    title: "Sort The Court",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sort-the-court.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/sort-the-court.html",
    isNew: false
  },
  {
    id: 264,
    title: "Soundboard",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/soundboard.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/soundboard.html",
    isNew: false
  },
  {
    id: 265,
    title: "Space Huggers",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spacehuggers.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spacehuggers.html",
    isNew: false
  },
  {
    id: 267,
    title: "Tiny Fragments",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tiny-fragments.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/tiny-fragments.html",
    isNew: false
  },
  {
    id: 268,
    title: "Tough Growth",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tough-growth.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/tough-growth.html",
    isNew: false
  },
  {
    id: 269,
    title: "Yoshi's Fabrication",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/yoshifabrication.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/yoshifabrication.html",
    isNew: false
  },
  {
    id: 270,
    title: "You Are Bezos",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/you-are-bezos.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/you-are-bezos.html",
    isNew: false
  },
  {
    id: 271,
    title: "Rolly Vortex",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rolly-vortex.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/rolly-vortex.html",
    isNew: false
  },
  {
    id: 272,
    title: "The little Giant",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/the-little-giant.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/the-little-giant.html",
    isNew: false
  },
  {
    id: 273,
    title: "Tiny Fishing",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tiny-fishing.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/tiny-fishing.html",
    isNew: false
  },
  {
    id: 274,
    title: "Boxel Rebound",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/boxel-rebound.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/boxel-rebound.html",
    isNew: false
  },
  {
    id: 275,
    title: "Canyon Defense",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/canyondefense.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/canyondefense.html",
    isNew: false
  },
  {
    id: 276,
    title: "Captain Callisto",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/captaincallisto.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/captaincallisto.html",
    isNew: false
  },
  {
    id: 277,
    title: "Duke Dashington Remastered",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/duke-dashington-remastered.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/duke-dashington-remastered.html",
    isNew: false
  },
  {
    id: 278,
    title: "Gravity Soccer",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gravity-soccer.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/gravity-soccer.html",
    isNew: false
  },
  {
    id: 279,
    title: "GrindCraft",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/grindcraft.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/grindcraft.html",
    isNew: false
  },
  {
    id: 280,
    title: "Big Tower Tiny Square",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bigtowertinysquare.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bigtowertinysquare.html",
    isNew: false
  },
  {
    id: 281,
    title: "Cupcake 2048",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cupcake2048.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/cupcake2048",
    isNew: false
  },
  {
    id: 282,
    title: "Gopher",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gopher.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/gopher.html",
    isNew: false
  },
  {
    id: 283,
    title: "Kitchen Gun Game",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kitchen-gun-game.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/kitchen-gun-game.html",
    isNew: false
  },
  {
    id: 284,
    title: "Kitten Cannon",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kittencannon.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/kittencannon.html",
    isNew: false
  },
  {
    id: 285,
    title: "Basket Bros 2025",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/basket-bros-io.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/basket-bros-io.html",
    isNew: false
  },
  {
    id: 286,
    title: "Basketball Legends 2020",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/basketball-legends-2020.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/basketball-legends-2020.html",
    isNew: false
  },
  {
    id: 287,
    title: "Meme 2048",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/meme2048.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/meme2048",
    isNew: false
  },
  {
    id: 288,
    title: "Green",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/green.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/green.html",
    isNew: false
  },
  {
    id: 289,
    title: "Hex Empire",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hexempire.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/hexempire.html",
    isNew: false
  },
  {
    id: 290,
    title: "Minesweeper",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/minesweeper.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/minesweeper.html",
    isNew: false
  },
  {
    id: 291,
    title: "Ultimate Custom Night",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/UCN-main.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/UCN/UCN-main",
    isNew: false
  },
  {
    id: 292,
    title: "Marvin Spectrum",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/marvinspectrum.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/marvinspectrum.html",
    isNew: false
  },
  {
    id: 293,
    title: "Pandemic 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pandemic2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/pandemic2.html",
    isNew: false
  },
  {
    id: 294,
    title: "Papas Freezeria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/papas-freezeria.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/papas-freezeria",
    isNew: false
  },
  {
    id: 295,
    title: "Papas Hot Doggeria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/papas-hot-doggeria.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/papas-hot-doggeria.html",
    isNew: false
  },
  {
    id: 296,
    title: "Nitro Me Must Die",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/nitromemustdie.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/nitromemustdie.html",
    isNew: false
  },
  {
    id: 297,
    title: "Golden Axe",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/goldenaxe.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/goldenaxe.html",
    isNew: false
  },
  {
    id: 298,
    title: "Cubefield",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cubefield.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/cubefield.html",
    isNew: false
  },
  {
    id: 299,
    title: "Cave Chaos",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cavechaos.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/cavechaos.html",
    isNew: false
  },
  {
    id: 300,
    title: "Cactus McCoy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cactusmccoy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/cactusmccoy.html",
    isNew: false
  },
  {
    id: 301,
    title: "Cactus McCoy 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cactusmccoy2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/cactusmccoy2.html",
    isNew: false
  },
  {
    id: 302,
    title: "Control Craft 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/controlcraft2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/controlcraft2.html",
    isNew: false
  },
  {
    id: 303,
    title: "Jetpack Joyride",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/jetpack.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/jetpack.html",
    isNew: false
  },
  {
    id: 304,
    title: "Epic Battle Fantasy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/epicbattlefantasy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/epicbattlefantasy.html",
    isNew: false
  },
  {
    id: 305,
    title: "Epic Battle Fantasy 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/epicbattlefantasy2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/epicbattlefantasy2.html",
    isNew: false
  },
  {
    id: 306,
    title: "Epic Battle Fantasy 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/epicbattlefantasy3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/epicbattlefantasy3.html",
    isNew: false
  },
  {
    id: 307,
    title: "Pickcrafter",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pickcrafter.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/pickcrafter.html",
    isNew: false
  },
  {
    id: 308,
    title: "Townscaper",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/townscaper.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/townscaper.html",
    isNew: false
  },
  {
    id: 309,
    title: "Watermelon Game",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/watermelongame.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/watermelongame.html",
    isNew: false
  },
  {
    id: 310,
    title: "Wordle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/wordle.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/wordle.html",
    isNew: false
  },
  {
    id: 311,
    title: "Mariokart 64",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mariokart64.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/mariokart64.html",
    isNew: false
  },
  {
    id: 312,
    title: "Adventure Capitalist",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/adventure-capitalist.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/adventure-capitalist.html",
    isNew: false
  },
  {
    id: 313,
    title: "Feed Me",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/feedme.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/feedme.html",
    isNew: false
  },
  {
    id: 314,
    title: "Multitask",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/multitask.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/multitask.html",
    isNew: false
  },
  {
    id: 315,
    title: "Oodle Gobs",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/oodlegobs.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/oodlegobs.html",
    isNew: false
  },
  {
    id: 316,
    title: "Pako Highway",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pakohighway.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/pakohighway.html",
    isNew: false
  },
  {
    id: 317,
    title: "Super Hero Drop",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/superherodrop.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/superherodrop.html",
    isNew: false
  },
  {
    id: 318,
    title: "Water Works",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/waterworks.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/waterworks.html",
    isNew: false
  },
  {
    id: 319,
    title: "Chime Clicker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chime.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chime.html",
    isNew: false
  },
  {
    id: 320,
    title: "60s Burger Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/60sburgerrun.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/60sburgerrun.html",
    isNew: false
  },
  {
    id: 321,
    title: "FNF: Friday Night Funkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/0.6.0.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfspag.html",
    isNew: false
  },
  {
    id: 322,
    title: "FNF: Friday Night Funkin' Girlfriend Mode",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gfmode.jpg",
    url: "https://reading.yoylefake.org/gfmode.html",
    isNew: false
  },
  {
    id: 323,
    title: "FNF: Friday Night Funkin' Spooky Mix️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spooky.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/spooky.html",
    isNew: false
  },
  {
    id: 324,
    title: "FNF: Friday Night Funkin' Child's Play Remake",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/child.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/child.html",
    isNew: false
  },
  {
    id: 325,
    title: "FNF: Friday Night Funkin' HD",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fnfhd.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/fnfhd.html",
    isNew: false
  },
  {
    id: 326,
    title: "FNF: Friday Night Funkin' RTX On",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rtx.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/rtx.html",
    isNew: false
  },
  {
    id: 327,
    title: "FNF: Friday Night Funkin' Funkadelix",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/funkadelix.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/funkadelix.html",
    isNew: false
  },
  {
    id: 328,
    title: "FNF: Friday Night Funkin' 3x3 Remixed",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/3x3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/3x3.html",
    isNew: false
  },
  {
    id: 329,
    title: "FNF: Friday Night Funkin' B-Sides",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bsides.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/bsides.html",
    isNew: false
  },
  {
    id: 330,
    title: "FNF: Friday Night Funkin' From The Top!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ftt.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ftt.html",
    isNew: false
  },
  {
    id: 331,
    title: "FNF: Get Digging - Fries vs. Needle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/digging.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/digging.html",
    isNew: false
  },
  {
    id: 332,
    title: "FNF: Let There Be Light",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ltbl.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ltbl.html",
    isNew: false
  },
  {
    id: 333,
    title: "FNF: FNF x Steven Universe Mod - Gem Jam",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gem.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/gem.html",
    isNew: false
  },
  {
    id: 334,
    title: "FNF: Mistful Crimson Morning Reboot",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mcm.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/mcm.html",
    isNew: false
  },
  {
    id: 335,
    title: "FNF: Untitled Femtanyl Mod",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/femtanyl.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/femtanyl.html",
    isNew: false
  },
  {
    id: 336,
    title: "FNF: SUPXR",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/supxr.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/supxr.html",
    isNew: false
  },
  {
    id: 337,
    title: "FNF: Vs. Momo: Ubume",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ubume.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/ubume.html",
    isNew: false
  },
  {
    id: 338,
    title: "FNF: Spookyboo!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spookyboo.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/spookyboo.html",
    isNew: false
  },
  {
    id: 339,
    title: "FNF: Fancy Funking",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fancy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/fancy.html",
    isNew: false
  },
  {
    id: 340,
    title: "FNF: Tetonic - Vs. Teto",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tetonic.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/tetonic.html",
    isNew: false
  },
  {
    id: 341,
    title: "FNF: NONACCEPTANCE",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/nonacceptance.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/nonacceptance.html",
    isNew: false
  },
  {
    id: 342,
    title: "FNF: Darkwing Funkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/darkwing.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/darkwing.html",
    isNew: false
  },
  {
    id: 343,
    title: "FNF: Cool Pokemon Mod",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pokemon.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/pokemon.html",
    isNew: false
  },
  {
    id: 344,
    title: "FNF: AKAGE",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/akage.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/akage.html",
    isNew: false
  },
  {
    id: 345,
    title: "FNF: Tabi Revival",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tabi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/tabi.html",
    isNew: false
  },
  {
    id: 346,
    title: "FNF: Creepypasta JP",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/yokai.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/yokai.html",
    isNew: false
  },
  {
    id: 347,
    title: "FNF: EVIL NOOB",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/noob.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/noob.html",
    isNew: false
  },
  {
    id: 348,
    title: "FNF: Blueballed V2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/blueball.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/blueball.html",
    isNew: false
  },
  {
    id: 349,
    title: "FNF: Friday Night Dashin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/Dashin.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/Dashin.html",
    isNew: false
  },
  {
    id: 350,
    title: "FNF: Plants Vs Rappers",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/plants.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/plants.html",
    isNew: false
  },
  {
    id: 351,
    title: "FNF: Mokey",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mokey.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/mokey.html",
    isNew: false
  },
  {
    id: 352,
    title: "FNF: Pacman.exe",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/PACKILL.jpg",
    url: "https://scientific.yoylefake.org/PACKILL.html",
    isNew: false
  },
  {
    id: 353,
    title: "FNF:Fake Jordans",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fakejs.jpg",
    url: "https://scientific.yoylefake.org/fakejs.html",
    isNew: false
  },
  {
    id: 354,
    title: "FNF: Friday Night Funkin' Lovewrec'd",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/lovewrecd.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/lovewrecd.html",
    isNew: false
  },
  {
    id: 355,
    title: "FNF: Friday Night Funkin' D-Sides",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dsides.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/dsides",
    isNew: false
  },
  {
    id: 356,
    title: "FNF: Friday Night Funkin' Neo",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/neo.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/neo.html",
    isNew: false
  },
  {
    id: 357,
    title: "FNF: Friday Night Funkin' Upside",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/upside.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/upside",
    isNew: false
  },
  {
    id: 358,
    title: "FNF: Friday Night Funkin' Beatstreets",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/beat.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/beat.html",
    isNew: false
  },
  {
    id: 359,
    title: "FNF: Friday Night Funkin' But Bad",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/badfnf.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/badfnf.html",
    isNew: false
  },
  {
    id: 360,
    title: "FNF: Friday Night Funkin' Gooey Mix",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gooey.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gooey.html",
    isNew: false
  },
  {
    id: 361,
    title: "FNF: Friday Night Funkin': Notice Me Senpai!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cloud.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/cloud.html",
    isNew: false
  },
  {
    id: 362,
    title: "FNF: Friday Night Funkin' Deep-Sea Date",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/seadate.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/seadate.html",
    isNew: false
  },
  {
    id: 363,
    title: "FNF: Friday Night Funkin' Hellbeats",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hell.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/hell",
    isNew: false
  },
  {
    id: 364,
    title: "FNF: Friday Night Funkin' Soft v1",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/soft.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/soft.html",
    isNew: false
  },
  {
    id: 365,
    title: "Friday Night Funkin' Starcatcher",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/starcatcher.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/starcatcher",
    isNew: false
  },
  {
    id: 366,
    title: "Friday Night Funkin' Starlight Mayhem",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/strlight.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/strlight",
    isNew: false
  },
  {
    id: 367,
    title: "FNF: Friday Night Funkin' FT. The Ex",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ex.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/ex.html",
    isNew: false
  },
  {
    id: 368,
    title: "FNF: Friday Night Funkin' Cheater",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cheater.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/cheater.html",
    isNew: false
  },
  {
    id: 369,
    title: "FNF: Friday Night Funkin' Hotline 024",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hotline.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/hotline.html",
    isNew: false
  },
  {
    id: 370,
    title: "FNF: Friday Night Funkin' CG5 Edition",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cg5.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/cg5.html",
    isNew: false
  },
  {
    id: 371,
    title: "FNF: Friday Night Funkin' Baddies",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/baddies.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/baddies.html",
    isNew: false
  },
  {
    id: 372,
    title: "FNF: Friday Night Funkin' Kero",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/Kero.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/Kero.html",
    isNew: false
  },
  {
    id: 373,
    title: "FNF: Friday Night Funkin': Cyber Sensation",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cyber.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/cyber.html",
    isNew: false
  },
  {
    id: 374,
    title: "FNF: Friday Night Funkin' Dusttale",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dust.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/dust.html",
    isNew: false
  },
  {
    id: 375,
    title: "FNF: Friday Night Funkin' Lullaby",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/lullaby.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/lullaby.html",
    isNew: false
  },
  {
    id: 376,
    title: "FNF: Friday Night Fever",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fever.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/fever.html",
    isNew: false
  },
  {
    id: 377,
    title: "FNF: Friday Night Fever: Skelly Story",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fevers.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fevers.html",
    isNew: false
  },
  {
    id: 378,
    title: "FNF: FNF Weekly: Tweakmas",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tweakmas.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/tweakmas.html",
    isNew: false
  },
  {
    id: 379,
    title: "FNF: Holo Night Funkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/holo.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/holo.html",
    isNew: false
  },
  {
    id: 380,
    title: "FNF: Viernes Night Funkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/viernes.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/viernes.html",
    isNew: false
  },
  {
    id: 381,
    title: "FNF: Another Friday Night",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/another.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/another.html",
    isNew: false
  },
  {
    id: 382,
    title: "FNF: Funkin' Aside",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/funkinaside.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/funkinaside.html",
    isNew: false
  },
  {
    id: 383,
    title: "FNF: Lite Funkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/lite.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/lite.html",
    isNew: false
  },
  {
    id: 384,
    title: "FNF: Arrow Funk",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/arrow.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/arrow.html",
    isNew: false
  },
  {
    id: 385,
    title: "FNF: VS. Whitty",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/whitty.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/whitty",
    isNew: false
  },
  {
    id: 386,
    title: "FNF: VS. Whitty Erect",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/whittyerect.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whitty.html",
    isNew: false
  },
  {
    id: 387,
    title: "FNF: VS. Claire",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/claire.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/claire.html",
    isNew: false
  },
  {
    id: 388,
    title: "FNF: Pico Night Punkin",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/test.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/test.html",
    isNew: false
  },
  {
    id: 389,
    title: "FNF: VS. Neo Whitty",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/neowhitty.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/neowhitty.html",
    isNew: false
  },
  {
    id: 390,
    title: "FNF: VS. Agoti",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/agoti.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/agoti.html",
    isNew: false
  },
  {
    id: 391,
    title: "FNF: VS. QT: Rewired",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/qtrewired.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/qtrewired.html",
    isNew: false
  },
  {
    id: 392,
    title: "FNF: VS. Mami ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mami.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/mami.html",
    isNew: false
  },
  {
    id: 393,
    title: "FNF: VS. Virus R",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/virusr.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/virusr.html",
    isNew: false
  },
  {
    id: 394,
    title: "FNF: VS. Pico",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pico.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/pico.html",
    isNew: false
  },
  {
    id: 395,
    title: "FNF: VS. Carol",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mami.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/mami.html",
    isNew: false
  },
  {
    id: 396,
    title: "FNF: VS. Retrospecter️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/retro.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/retro.html",
    isNew: false
  },
  {
    id: 397,
    title: "FNF: VS. Darwi V2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/darwi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/darwi.html",
    isNew: false
  },
  {
    id: 398,
    title: "FNF: VS. Agoti Mic'd Up Engine",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/agotitest.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/agotitest.html",
    isNew: false
  },
  {
    id: 399,
    title: "FNF: VS.Peppino",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pizzatown.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/pizzatown.html",
    isNew: false
  },
  {
    id: 400,
    title: "FNF: VS.Maddness Erect",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/trickyerect.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/trickyerect.html",
    isNew: false
  },
  {
    id: 401,
    title: "FNF: Sunday Night Suicide V2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/smouse.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/smouse.html",
    isNew: false
  },
  {
    id: 402,
    title: "FNF: VS.Black Betrayal",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/blackb.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/blackb.html",
    isNew: false
  },
  {
    id: 403,
    title: "FNF: VS.Cheeky v3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cheeky.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/cheeky.html",
    isNew: false
  },
  {
    id: 404,
    title: "FNF: VS.Trollge V2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/physics.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/physics.html",
    isNew: false
  },
  {
    id: 405,
    title: "FNF: Doki Doki Bad Ending",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/badending.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/badending.html",
    isNew: false
  },
  {
    id: 406,
    title: "FNF: CN Takeover",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cntakeover.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/cntakeover.html",
    isNew: false
  },
  {
    id: 407,
    title: "FNF: VS. Impostor",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/impo.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/impo.html",
    isNew: false
  },
  {
    id: 408,
    title: "FNF: VS. Big Brother",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bigbro.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/bigbro.html",
    isNew: false
  },
  {
    id: 409,
    title: "FNF: VS. Camellia",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/camellia.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/camellia.html",
    isNew: false
  },
  {
    id: 410,
    title: "FNF: VS. Accelerant Hank, but all bullets",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hankgoeshard.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/hankgoeshard.html",
    isNew: false
  },
  {
    id: 411,
    title: "FNF: VS. Annie",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/annie.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/annie.html",
    isNew: false
  },
  {
    id: 412,
    title: "FNF: VS. Hatsune Miku",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/miku.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/miku.html",
    isNew: false
  },
  {
    id: 413,
    title: "FNF: VS. Chara",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chara.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/chara.html",
    isNew: false
  },
  {
    id: 414,
    title: "FNF: VS. K.K. Slider",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/vskk.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/vskk.html",
    isNew: false
  },
  {
    id: 415,
    title: "FNF: VS. Super Idol",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/idol.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/idol.html",
    isNew: false
  },
  {
    id: 416,
    title: "FNF: VS. FNAF 3 ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/FNAF.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/FNAF.html",
    isNew: false
  },
  {
    id: 417,
    title: "FNF: VS. Sky",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sky.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/sky.html",
    isNew: false
  },
  {
    id: 418,
    title: "FNF: VS. 'FNF Kid'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kid.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/kid.html",
    isNew: false
  },
  {
    id: 419,
    title: "FNF: VS. Lime Green Imposter (Imposter v5 April Fools Week)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/lime.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/lime.html",
    isNew: false
  },
  {
    id: 420,
    title: "FNF: VS. Sonic.exe ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sonic.exe.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/sonic.exe.html",
    isNew: false
  },
  {
    id: 421,
    title: "FNF: VS. Nero",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/nero.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/nero.html",
    isNew: false
  },
  {
    id: 422,
    title: "FNF: VS. Ron  ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/Ron.3.0.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/Ron.3.0.html",
    isNew: false
  },
  {
    id: 423,
    title: "FNF: VS. Rika",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rika.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/rika.html",
    isNew: false
  },
  {
    id: 424,
    title: "FNF: VS. Speedrunner Mario",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/yas.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/yas.html",
    isNew: false
  },
  {
    id: 425,
    title: "FNF: VS. King",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/king.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/king.html",
    isNew: false
  },
  {
    id: 426,
    title: "FNF: VS. Hex",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hex.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/hex.html",
    isNew: false
  },
  {
    id: 427,
    title: "FNF: VS. Slenderman",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/slenderman.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/slenderman.html",
    isNew: false
  },
  {
    id: 428,
    title: "FNF: VS. Sunday",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sunday.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/sunday.html",
    isNew: false
  },
  {
    id: 429,
    title: "FNF: VS. Corrupted Tankman",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cn.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/cn.html",
    isNew: false
  },
  {
    id: 430,
    title: "FNF: VS. Shaggy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/shaggy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/shaggy.html",
    isNew: false
  },
  {
    id: 431,
    title: "FNF: VS. Nonsense",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/nonsence.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/nonsence.html",
    isNew: false
  },
  {
    id: 432,
    title: "FNF: VS. Spong",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spong.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/spong.html",
    isNew: false
  },
  {
    id: 433,
    title: "FNF: VS. Timmy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pwrhr.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/pwrhr.html",
    isNew: false
  },
  {
    id: 434,
    title: "FNF: VS. Tord",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tord.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/tord.html",
    isNew: false
  },
  {
    id: 435,
    title: "FNF: VS. Tabi",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tabi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/tabi.html",
    isNew: false
  },
  {
    id: 436,
    title: "FNF: VS. QT",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/qt.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/qt.html",
    isNew: false
  },
  {
    id: 437,
    title: "FNF: VS. Doxxie",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/doxxie.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/doxxie.html",
    isNew: false
  },
  {
    id: 438,
    title: "FNF: VS. Zardy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/zardyupdate.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/zardyupdate.html",
    isNew: false
  },
  {
    id: 439,
    title: "FNF: CORROSION",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/corrosion.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/corrosion.html",
    isNew: false
  },
  {
    id: 440,
    title: "FNF: CORROSION V2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/corrosion.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/corrosion.html",
    isNew: false
  },
  {
    id: 441,
    title: "FNF: Twiddlefinger",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/twiddlefinger.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/twiddlefinger.html",
    isNew: false
  },
  {
    id: 442,
    title: "FNF: ANOTHERBROTHER",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/anotherbrother.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/anotherbrother.html",
    isNew: false
  },
  {
    id: 443,
    title: "FNF: HORKGLORPGLOOP",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hork.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/hork.html",
    isNew: false
  },
  {
    id: 444,
    title: "FNF: Konton Boogie ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/konton.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/konton.html",
    isNew: false
  },
  {
    id: 445,
    title: "FNF: Bob and Bosip: The EX Update",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bob.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/bob",
    isNew: false
  },
  {
    id: 446,
    title: "FNF: Dave and Bambi Golden Apple ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/GoldenApple.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/GoldenApple.html",
    isNew: false
  },
  {
    id: 447,
    title: "FNF: Nyaw Erect",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/nyaw.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/nyaw.html",
    isNew: false
  },
  {
    id: 448,
    title: "FNF: VS. Tabi: Pico Mix",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tabip.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/tabip.html",
    isNew: false
  },
  {
    id: 449,
    title: "FNF: Silly Funkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/silly.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/silly.html",
    isNew: false
  },
  {
    id: 450,
    title: "FNF: Strident Crisis",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/strident.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/strident.html",
    isNew: false
  },
  {
    id: 451,
    title: "FNF: Spookys Saturday Scare",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spookyscare.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/spookyscare.html",
    isNew: false
  },
  {
    id: 452,
    title: "FNF: Scratch Cat",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/scratch.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/scratch.html",
    isNew: false
  },
  {
    id: 453,
    title: "FNF: Aflac Remaster",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/aflac.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/aflac.html",
    isNew: false
  },
  {
    id: 454,
    title: "FNF: Mario's Madness V2 ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/MM.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/MM.html",
    isNew: false
  },
  {
    id: 455,
    title: "FNF: Voiid Chronicles ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/void.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/void.html",
    isNew: false
  },
  {
    id: 456,
    title: "FNF: Yeah! - Internet Oneshot",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/yeah.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/yeah.html",
    isNew: false
  },
  {
    id: 457,
    title: "FNF: Madness Incident: 0201A",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/madness.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/madness.html",
    isNew: false
  },
  {
    id: 458,
    title: "FNF: Nusky",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/nusky.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/nusky.html",
    isNew: false
  },
  {
    id: 459,
    title: "FNF: Grafitti Groovin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/grafitti.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/grafitti.html",
    isNew: false
  },
  {
    id: 460,
    title: "FNF: The Full-Ass Tricky Mod ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tricky.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/tricky",
    isNew: false
  },
  {
    id: 461,
    title: "FNF: 17Bucks",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/17bucks.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/17bucks.html",
    isNew: false
  },
  {
    id: 462,
    title: "FNF: Indie Cross ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/indie.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/indie",
    isNew: false
  },
  {
    id: 463,
    title: "FNF: 2Hot: Freestyle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/2hot.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2hot.html",
    isNew: false
  },
  {
    id: 464,
    title: "FNF: 2Hot: BF Mix",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/2hotbf.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/2hotbf.html",
    isNew: false
  },
  {
    id: 465,
    title: "FNF: Spongebob's Classic Showdown",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spongebob.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/spongebob.html",
    isNew: false
  },
  {
    id: 466,
    title: "FNF: Next Out of Robloxia",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/roadblocks.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/roadblocks.html",
    isNew: false
  },
  {
    id: 467,
    title: "FNF: Hatsune Miku: Project Funkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/project.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/project.html",
    isNew: false
  },
  {
    id: 468,
    title: "FNF: Bopcity",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bop.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/bop.html",
    isNew: false
  },
  {
    id: 469,
    title: "FNF: Arcade Showdown",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/kapi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/kapi.html",
    isNew: false
  },
  {
    id: 470,
    title: "FNF: Beats and Treats",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/beatstreats.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/beatstreats.html",
    isNew: false
  },
  {
    id: 471,
    title: "FNF: Pibby Corrupted ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pibby.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/pibby.html",
    isNew: false
  },
  {
    id: 472,
    title: "FNF: Jeffy's Endless Aethos",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/aethos.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/aethos.html",
    isNew: false
  },
  {
    id: 473,
    title: "FNF: Shucks v2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/shucks.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/shucks.html",
    isNew: false
  },
  {
    id: 474,
    title: "FNF: Hazy River",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hazy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/hazy.html",
    isNew: false
  },
  {
    id: 475,
    title: "FNF: Twinsomnia",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/twin.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/twin.html",
    isNew: false
  },
  {
    id: 476,
    title: "FNF: Breaking Point",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/jaiden.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/jaiden.html",
    isNew: false
  },
  {
    id: 477,
    title: "FNF: Mid Fight Masses",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mfm.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/mfm.html",
    isNew: false
  },
  {
    id: 478,
    title: "FNF: Tales from the Treehouse",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tree.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/tree.html",
    isNew: false
  },
  {
    id: 479,
    title: "FNF: Sideline Blitz",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sideline.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/sideline.html",
    isNew: false
  },
  {
    id: 480,
    title: "FNF: The Date Week",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/date.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/date.html",
    isNew: false
  },
  {
    id: 481,
    title: "FNF: Yeahman!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/yeahman.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/yeahman.html",
    isNew: false
  },
  {
    id: 482,
    title: "FNF: Steven Universe Mini Mod Pack",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/steven.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/steven.html",
    isNew: false
  },
  {
    id: 483,
    title: "FNF: Roastin' on a Cartoon Cartoon Friday",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/roastin.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/roastin.html",
    isNew: false
  },
  {
    id: 484,
    title: "FNF: Beach Party",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/beach.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/beach.html",
    isNew: false
  },
  {
    id: 485,
    title: "FNF: Chaos Nightmare",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/phantasm.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/phantasm.html",
    isNew: false
  },
  {
    id: 486,
    title: "FNF: Sprunkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sprunki.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/sprunki.html",
    isNew: false
  },
  {
    id: 487,
    title: "FNF: Funkin' for Hire",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hire.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/hire.html",
    isNew: false
  },
  {
    id: 488,
    title: "FNF: Funkin' Peanuts",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/snoopy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/snoopy.html",
    isNew: false
  },
  {
    id: 489,
    title: "FNF: Another Atrocity Fanmod",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/atrocity.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/atrocity.html",
    isNew: false
  },
  {
    id: 490,
    title: "FNF: Mistful Crimson Morning",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/MCM.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/MCM.html",
    isNew: false
  },
  {
    id: 491,
    title: "FNF: The X-Event",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/x-event.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/x-event.html",
    isNew: false
  },
  {
    id: 492,
    title: "FNF: Starving Artist",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/starve.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/starve.html",
    isNew: false
  },
  {
    id: 493,
    title: "FNF: Flavor Rave",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/flavor.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/flavor.html",
    isNew: false
  },
  {
    id: 494,
    title: "FNF: RoFNF Funkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rofnf.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/rofnf.html",
    isNew: false
  },
  {
    id: 495,
    title: "FNF: Baldi's Basics in Funkin'",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/baldi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/baldi.html",
    isNew: false
  },
  {
    id: 496,
    title: "FNF: Deb8",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/deb8.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/deb8.html",
    isNew: false
  },
  {
    id: 497,
    title: "FNF: Killshot",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/killshot.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/killshot.html",
    isNew: false
  },
  {
    id: 498,
    title: "FNF: 13th Night Funk Blood️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/funkblood.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/funkblood.html",
    isNew: false
  },
  {
    id: 499,
    title: "FNF: Lobotomy Dash Funkin' ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/lobotomy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/lobotomy.html",
    isNew: false
  },
  {
    id: 500,
    title: "FNF: Gamblecore",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gamblecore.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/gamblecore.html",
    isNew: false
  },
  {
    id: 501,
    title: "FNF: Parkpass",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/parkpass.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/parkpass.html",
    isNew: false
  },
  {
    id: 502,
    title: "FNF: OK K.O.! Let's Get Funky!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/K.O.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/K.O.html",
    isNew: false
  },
  {
    id: 503,
    title: "FNF: Hell Allany",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/alany.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/alany.html",
    isNew: false
  },
  {
    id: 504,
    title: "FNF: Darkness Takeover vs Pibby Family Guy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/darkness-takeover.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/darkness-takeover.html",
    isNew: false
  },
  {
    id: 505,
    title: "FNF: SMW: Power Star Melody",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/smw.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/smw.html",
    isNew: false
  },
  {
    id: 506,
    title: "FNF: COME OUT TO PLAY - Vs. MC-X",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mc-x.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/mc-x.html",
    isNew: false
  },
  {
    id: 507,
    title: "FNF: FNF Vs Bad Piggies (Ross V2)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bad-pig.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/bad-pig.html",
    isNew: false
  },
  {
    id: 508,
    title: "FNF: Funkin' In The Galaxy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/in-the-gal.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/in-the-gal.html",
    isNew: false
  },
  {
    id: 509,
    title: "FNF: Funkin'Herobrine Reborn",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/herob.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/herob.html",
    isNew: false
  },
  {
    id: 510,
    title: "FNF: Pibby Legacy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pibby-legacy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/pibby-legacy.html",
    isNew: false
  },
  {
    id: 511,
    title: "FNF: Vs.Undertale",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/undertale.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/undertale.html",
    isNew: false
  },
  {
    id: 512,
    title: "FNF: BFDI 26",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bdfi26.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/bdfi26.html",
    isNew: false
  },
  {
    id: 513,
    title: "FNF: The Return Funkin' Whitty Demo",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/return.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/return.html",
    isNew: false
  },
  {
    id: 514,
    title: "FNF: Bob's Onslaught",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bob.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/bob.html",
    isNew: false
  },
  {
    id: 515,
    title: "FNF: SMB Funk Mix DX",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/funk-mix.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/funk-mix.html",
    isNew: false
  },
  {
    id: 516,
    title: "FNF: SMB Funk Mix DX Game Over",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gameover.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gameover.html",
    isNew: false
  },
  {
    id: 517,
    title: "FNF: Salty's Sunday Night",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/salty.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/salty",
    isNew: false
  },
  {
    id: 518,
    title: "FNF: Fuckin Funkin' with Koi",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/koi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/koi.html",
    isNew: false
  },
  {
    id: 519,
    title: "FNF: Doki Doki Takeover Plus !",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/doki.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/doki.html",
    isNew: false
  },
  {
    id: 520,
    title: "FNF: MiFunkSide",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mifunkside.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/mifunkside.html",
    isNew: false
  },
  {
    id: 521,
    title: "FNF: Cartoon Clash",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/clash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/clash",
    isNew: false
  },
  {
    id: 522,
    title: "FNF: Silly Billy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/billy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/billy",
    isNew: false
  },
  {
    id: 523,
    title: "FNF: Secret Histories",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/secretSonic.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/secretSonic",
    isNew: false
  },
  {
    id: 524,
    title: "FNF: The Squidward Tricky Mod ️",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/squidtricky.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/squidtricky",
    isNew: false
  },
  {
    id: 525,
    title: "FNF: The Impossible Trio",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/IT.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/IT.html",
    isNew: false
  },
  {
    id: 526,
    title: "FNF: Doubling Down",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/doubleingdown.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/doubleingdown.html",
    isNew: false
  },
  {
    id: 527,
    title: "FNF: MOB MOD",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mobmod.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/mobmod.html",
    isNew: false
  },
  {
    id: 528,
    title: "FNF: Digitalizing 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/digi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/digi.html",
    isNew: false
  },
  {
    id: 529,
    title: "FNF: The Gacha Mod",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gacha.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/gacha",
    isNew: false
  },
  {
    id: 530,
    title: "FNF: Golf Minigame",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/golf.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/golf",
    isNew: false
  },
  {
    id: 531,
    title: "FNF: Funkin' for a BFDI",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bfdi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/bfdi.html",
    isNew: false
  },
  {
    id: 532,
    title: "FNF: Smoke Em' Out Struggle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/garcello.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/garcello.html",
    isNew: false
  },
  {
    id: 533,
    title: "FNF: Wii Funkin' REV-MIX",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/REV-MIX.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/REV-MIX.html",
    isNew: false
  },
  {
    id: 534,
    title: "FNF: Wii Funkin' B-Sides",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mattbside.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/mattbside.html",
    isNew: false
  },
  {
    id: 535,
    title: "FNF: Wii Funkin' Wiik 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/matt3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/matt3.html",
    isNew: false
  },
  {
    id: 536,
    title: "FNF: Krusty Karoling",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/krusty.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/krusty.html",
    isNew: false
  },
  {
    id: 537,
    title: "FNF: Funk! Miss Nagatoro",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/funknaga.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/funknaga.html",
    isNew: false
  },
  {
    id: 538,
    title: "FNF: Pibby Apocalypse",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pibby2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/maths/pibby2",
    isNew: false
  },
  {
    id: 539,
    title: "FNF: Corruption Invasion",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/invadion.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnfmods/invadion.html",
    isNew: false
  },
  {
    id: 540,
    title: "Fancy Pants World 1 Remix",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fancypantsadventuresremix.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/fancypantsadventuresremix.html",
    isNew: false
  },
  {
    id: 541,
    title: "Tunnel Rush",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tunnelrush.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/tunnelrush.html",
    isNew: false
  },
  {
    id: 542,
    title: "3 line",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/3line.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/3line.html",
    isNew: false
  },
  {
    id: 543,
    title: "Balloon Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/balloonrun.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/balloonrun.html",
    isNew: false
  },
  {
    id: 544,
    title: "Big Red Button",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bigredbutton.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bigredbutton.html",
    isNew: false
  },
  {
    id: 545,
    title: "Bike Champ",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bikechamp.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bikechamp.html",
    isNew: false
  },
  {
    id: 546,
    title: "Bubble Spinner",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bubblespinner.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/bubblespinner.html",
    isNew: false
  },
  {
    id: 547,
    title: "Canopy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/canopy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/canopy.html",
    isNew: false
  },
  {
    id: 548,
    title: "Celeste (PICO 8)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/celeste.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/celeste.html",
    isNew: false
  },
  {
    id: 549,
    title: "Chisel",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chisel.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chisel.html",
    isNew: false
  },
  {
    id: 550,
    title: "Chisel 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chisel2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chisel2.html",
    isNew: false
  },
  {
    id: 551,
    title: "ABCya! Coin",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/coin.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/coin.html",
    isNew: false
  },
  {
    id: 552,
    title: "Burger And Frights",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/burgerandfrights.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/burgerandfrights.html",
    isNew: false
  },
  {
    id: 553,
    title: "Crash Bandicoot: The Wrath of Cortex",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/crash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/crash.html",
    isNew: false
  },
  {
    id: 554,
    title: "Geometry Dash Lite",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gdlite.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/gdlite.html",
    isNew: false
  },
  {
    id: 555,
    title: "Geometry Dash (Fake)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/geometrydash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/geometrydash.html",
    isNew: false
  },
  {
    id: 556,
    title: "Geometry Rash",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/geometryrash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/geometryrash.html",
    isNew: false
  },
  {
    id: 560,
    title: "Brave Explorers",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/brave-explorers.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/brave-explorers.html",
    isNew: false
  },
  {
    id: 561,
    title: "Glass City",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/glass-city.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/glass-city.html",
    isNew: false
  },
  {
    id: 562,
    title: "Go Ball",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/go-ball.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/go-ball.html",
    isNew: false
  },
  {
    id: 563,
    title: "Push Your Luck",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/push-your-luck.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/push-your-luck.html",
    isNew: false
  },
  {
    id: 564,
    title: "Scratch RPG By Jalen",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/scratchrpg.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/scratchrpg.html",
    isNew: false
  },
  {
    id: 565,
    title: "Spelunky",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spelunky.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spelunky.html",
    isNew: false
  },
  {
    id: 566,
    title: "Swerve",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/swerve.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/swerve.html",
    isNew: false
  },
  {
    id: 567,
    title: "Synesthesia",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/synesthesia.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/synesthesia.html",
    isNew: false
  },
  {
    id: 568,
    title: "Tactical Assasin2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tacticalassasin2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/tacticalassasin2.html",
    isNew: false
  },
  {
    id: 569,
    title: "Adrenaline Challenge",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/adrenalinechallenge.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/adrenalinechallenge.html",
    isNew: false
  },
  {
    id: 570,
    title: "Back Country",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/backcountry.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/backcountry.html",
    isNew: false
  },
  {
    id: 571,
    title: "Champion Archer",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/championarcher.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/championarcher.html",
    isNew: false
  },
  {
    id: 572,
    title: "Endless War 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/endlesswar3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/endlesswar3.html",
    isNew: false
  },
  {
    id: 573,
    title: "Finns Fantastic Food Machine",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/finns-fantastic-food-machine.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/finns-fantastic-food-machine.html",
    isNew: false
  },
  {
    id: 574,
    title: "10 Minutes Till Dawn",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/10-minutes-till-dawn.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/10-minutes-till-dawn.html",
    isNew: false
  },
  {
    id: 575,
    title: "2048",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/2048.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/2048.html",
    isNew: false
  },
  {
    id: 576,
    title: "2d rocket league",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/2drocketleague.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/2drocketleague.html",
    isNew: false
  },
  {
    id: 577,
    title: "A Dance Of Fire And Ice",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/adofai.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/adofai.html",
    isNew: false
  },
  {
    id: 578,
    title: "a dark room",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/adarkroom.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/adarkroom.html",
    isNew: false
  },
  {
    id: 579,
    title: "achievement unlocked",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/achievementunlocked.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/achievementunlocked.html",
    isNew: false
  },
  {
    id: 580,
    title: "age of war",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ageofwar.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ageofwar.html",
    isNew: false
  },
  {
    id: 581,
    title: "Alien Hominid",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/alienhominid.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/alienhominid.html",
    isNew: false
  },
  {
    id: 582,
    title: "Amazing Rope Police",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/amazing-rope-police.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/amazing-rope-police.html",
    isNew: false
  },
  {
    id: 583,
    title: "Amorphous",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/amorphous.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/amorphous.html",
    isNew: false
  },
  {
    id: 584,
    title: "Angry Birds",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/birds.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/birds.html",
    isNew: false
  },
  {
    id: 585,
    title: "Angry Birds Rio",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rio.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/rio.html",
    isNew: false
  },
  {
    id: 586,
    title: "Angry Birds Space",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/abspace.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/abspace.html",
    isNew: false
  },
  {
    id: 587,
    title: "Astray",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/astray.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/astray.html",
    isNew: false
  },
  {
    id: 588,
    title: "Avalanche",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/avalanche.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/avalanche.html",
    isNew: false
  },
  {
    id: 589,
    title: "Backflip Dive 3d",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/backflip-dive-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/backflip-dive-3d.html",
    isNew: false
  },
  {
    id: 590,
    title: "Bad Time Simulator",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/badtimesimulator.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/badtimesimulator.html",
    isNew: false
  },
  {
    id: 591,
    title: "Baldi's Basics",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/baldis-basics.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/baldis-basics.html",
    isNew: false
  },
  {
    id: 592,
    title: "Basket Bros",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/basketbros.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/basketbros.html",
    isNew: false
  },
  {
    id: 593,
    title: "Basket Random",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/basketrandom.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/basketrandom.html",
    isNew: false
  },
  {
    id: 594,
    title: "Basketball Stars",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/basketball-stars.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/basketball-stars.html",
    isNew: false
  },
  {
    id: 595,
    title: "BFDIA 5b",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bfdia.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/bfdia.html",
    isNew: false
  },
  {
    id: 596,
    title: "Binding Of Isaac",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/binding-of-isaac.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/binding-of-isaac.html",
    isNew: false
  },
  {
    id: 597,
    title: "Bit Planes",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bit-planes.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/bit-planes.html",
    isNew: false
  },
  {
    id: 598,
    title: "Bitlife",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bitlife.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/bitlife.html",
    isNew: false
  },
  {
    id: 599,
    title: "Block Blast",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/block.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/block.html",
    isNew: false
  },
  {
    id: 600,
    title: "Blood Tournament",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bloodtournament.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/bloodtournament.html",
    isNew: false
  },
  {
    id: 601,
    title: "Bloons",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bloons.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/bloons.html",
    isNew: false
  },
  {
    id: 602,
    title: "Bob The Robber 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bobtherobber2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/bobtherobber2.html",
    isNew: false
  },
  {
    id: 603,
    title: "Boxing Physics 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/boxingphysics2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/boxingphysics2.html",
    isNew: false
  },
  {
    id: 604,
    title: "Breaking The Bank",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/breakingthebank.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/breakingthebank.html",
    isNew: false
  },
  {
    id: 605,
    title: "Breaklock",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/breaklock.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/breaklock.html",
    isNew: false
  },
  {
    id: 606,
    title: "Breakout",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/breakout.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/breakout.html",
    isNew: false
  },
  {
    id: 607,
    title: "Candy Clicker By Jalen",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/candy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/candy.html",
    isNew: false
  },
  {
    id: 608,
    title: "FNF: GUMMIBAR!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gummi.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/gummi.html",
    isNew: false
  },
  {
    id: 609,
    title: "Champion Island",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/championisland.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/championisland.html",
    isNew: false
  },
  {
    id: 610,
    title: "Chess",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chess.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/chess.html",
    isNew: false
  },
  {
    id: 611,
    title: "Choose Your Weapon",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chooseyourweapon.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chooseyourweapon.html",
    isNew: false
  },
  {
    id: 612,
    title: "Choose Your Weapon 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chooseyourweapon2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chooseyourweapon2.html",
    isNew: false
  },
  {
    id: 613,
    title: "Choose Your Weapon 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/chooseyourweapon3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chooseyourweapon3.html",
    isNew: false
  },
  {
    id: 614,
    title: "Chrome Dino",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dino.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/dino.html",
    isNew: false
  },
  {
    id: 615,
    title: "Clicker Heroes",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/clickerheroes.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/clickerheroes.html",
    isNew: false
  },
  {
    id: 616,
    title: "Cluster Rush",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/cluster-rush.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/cluster-rush.html",
    isNew: false
  },
  {
    id: 617,
    title: "Color Switch",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/colorswitch.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/colorswitch.html",
    isNew: false
  },
  {
    id: 618,
    title: "Commodore Clicker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/commodoreclicker.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/commodoreclicker.html",
    isNew: false
  },
  {
    id: 619,
    title: "Cookie Clicker Classic",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/Cookie-Clicker-Classic-main.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cookieclicker.html",
    isNew: false
  },
  {
    id: 620,
    title: "Cooking Mama",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cookingmama.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cookingmama.html",
    isNew: false
  },
  {
    id: 621,
    title: "Crazy Cars",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/CrazyCars.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/CrazyCars.html",
    isNew: false
  },
  {
    id: 622,
    title: "Creative Kill Chamber",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/creativekillchamber.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/creativekillchamber.html",
    isNew: false
  },
  {
    id: 623,
    title: "Crossy Road",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/crossy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/crossy.html",
    isNew: false
  },
  {
    id: 624,
    title: "CSGO Clicker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/csgoclicker.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/csgoclicker.html",
    isNew: false
  },
  {
    id: 625,
    title: "Cut The Rope",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rope.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/rope.html",
    isNew: false
  },
  {
    id: 627,
    title: "Death Run 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/death-run-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/death-run-3d.html",
    isNew: false
  },
  {
    id: 628,
    title: "Dirt Racers",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dirt.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/dirt.html",
    isNew: false
  },
  {
    id: 629,
    title: "Doge Miner",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/DogeMiner.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/DogeMiner.html",
    isNew: false
  },
  {
    id: 630,
    title: "Doodle Jump",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/doodlejump.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/doodlejump.html",
    isNew: false
  },
  {
    id: 631,
    title: "DragonBall Devolution",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dragonballdevolution.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/dragonballdevolution.html",
    isNew: false
  },
  {
    id: 632,
    title: "Draw The Hill",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/draw-the-hill.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/draw-the-hill.html",
    isNew: false
  },
  {
    id: 633,
    title: "Drift Boss",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/drift-boss.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/drift-boss.html",
    isNew: false
  },
  {
    id: 634,
    title: "Drift Hunters",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/drifthunters.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/drifthunters.html",
    isNew: false
  },
  {
    id: 635,
    title: "Duck life",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ducklife.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ducklife.html",
    isNew: false
  },
  {
    id: 636,
    title: "Duck life 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ducklife2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ducklife2.html",
    isNew: false
  },
  {
    id: 637,
    title: "Duck life 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ducklife3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ducklife3.html",
    isNew: false
  },
  {
    id: 638,
    title: "Duck life 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ducklife4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ducklife4.html",
    isNew: false
  },
  {
    id: 639,
    title: "Duck life 5 Treasure Hunt",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/duck-life-treasurehunt.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/duck-life-treasurehunt.html",
    isNew: false
  },
  {
    id: 640,
    title: "Dungeon Craft",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/dungeon-craft.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/dungeon-craft.html",
    isNew: false
  },
  {
    id: 641,
    title: "Electricman 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/electricman2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/electricman2.html",
    isNew: false
  },
  {
    id: 642,
    title: "Escaping The Prison",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/escapingtheprison.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/escapingtheprison.html",
    isNew: false
  },
  {
    id: 643,
    title: "Evolution",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/evolution.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/evolution.html",
    isNew: false
  },
  {
    id: 644,
    title: "Factory Balls",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/factoryballs.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/factoryballs.html",
    isNew: false
  },
  {
    id: 645,
    title: "Factory Balls Forever",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/factory-balls-forever.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/factory-balls-forever.html",
    isNew: false
  },
  {
    id: 646,
    title: "Fancy Pants Adventures",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fancypantsadventures.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fancypantsadventures.html",
    isNew: false
  },
  {
    id: 647,
    title: "Fancy Pants Adventures 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fancypantsadventures2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fancypantsadventures2.html",
    isNew: false
  },
  {
    id: 648,
    title: "Fancy Pants Adventures 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fancypantsadvantures3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fancypantsadvantures3.html",
    isNew: false
  },
  {
    id: 649,
    title: "Fireboy and Watergirl",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fireboywatergirl.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fireboywatergirl.html",
    isNew: false
  },
  {
    id: 650,
    title: "Fireboy and Watergirl 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fireboywatergirl2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fireboywatergirl2.html",
    isNew: false
  },
  {
    id: 651,
    title: "Fireboy and Watergirl 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fireboywatergirl3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fireboywatergirl3.html",
    isNew: false
  },
  {
    id: 652,
    title: "Fireboy and Watergirl 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fireboywatergirl4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fireboywatergirl4.html",
    isNew: false
  },
  {
    id: 653,
    title: "Flappy Bird",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/flappybird.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/flappybird.html",
    isNew: false
  },
  {
    id: 654,
    title: "fleeing The Complex",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fleeingthecomplex.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fleeingthecomplex.html",
    isNew: false
  },
  {
    id: 655,
    title: "Flippy Fish",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/flippy-fish.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/flippy-fish.html",
    isNew: false
  },
  {
    id: 656,
    title: "Floodrunner 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/floodrunner2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/floodrunner2.html",
    isNew: false
  },
  {
    id: 657,
    title: "Floodrunner 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/floodrunner3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/floodrunner3.html",
    isNew: false
  },
  {
    id: 658,
    title: "Fluidsim",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fluidsim.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fluidsim.html",
    isNew: false
  },
  {
    id: 660,
    title: "Free Rider 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/free-rider-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/free-rider-2.html",
    isNew: false
  },
  {
    id: 661,
    title: "Frost Bite",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/frostbite.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/frostbite.html",
    isNew: false
  },
  {
    id: 662,
    title: "Frost Bite 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/frostbite2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/frostbite2.html",
    isNew: false
  },
  {
    id: 663,
    title: "Fruit Ninja",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ninja.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ninja.html",
    isNew: false
  },
  {
    id: 664,
    title: "Funny Ball Game",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/funnyballgame.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/funnyballgame.html",
    isNew: false
  },
  {
    id: 665,
    title: "Funny Mad Racing",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/funnymadracing.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/funnymadracing.html",
    isNew: false
  },
  {
    id: 666,
    title: "Funny Shooter",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/funnyshooter.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/funnyshooter.html",
    isNew: false
  },
  {
    id: 667,
    title: "Funny Shooter 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/funnyshooter2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/funnyshooter2.html",
    isNew: false
  },
  {
    id: 668,
    title: "Game Maker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gamemaker.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/gamemaker.html",
    isNew: false
  },
  {
    id: 669,
    title: "Getaway Shootout",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/getaway-shootout.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/getaway-shootout.html",
    isNew: false
  },
  {
    id: 670,
    title: "Gumball Splash Master",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/splash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/splash.html",
    isNew: false
  },
  {
    id: 671,
    title: "Gun Mayhem",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gunmayhem.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/gunmayhem.html",
    isNew: false
  },
  {
    id: 672,
    title: "Gun Mayhem 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/gunmayhem2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/gunmayhem2.html",
    isNew: false
  },
  {
    id: 673,
    title: "Hacker Type",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/hackertype.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/hackertype.html",
    isNew: false
  },
  {
    id: 674,
    title: "Happy Hop",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/happy-hop.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/happy-hop.html",
    isNew: false
  },
  {
    id: 675,
    title: "Happy Wheels",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/happywheels.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/happywheels.html",
    isNew: false
  },
  {
    id: 676,
    title: "Helicopter",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/helicopter.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/helicopter.html",
    isNew: false
  },
  {
    id: 677,
    title: "Helix Jump",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/helixjump.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/helixjump.html",
    isNew: false
  },
  {
    id: 678,
    title: "House Of Hazards",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/house-of-hazards.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/house-of-hazards.html",
    isNew: false
  },
  {
    id: 679,
    title: "Idle Breakout",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/idle-breakout.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/idle-breakout.html",
    isNew: false
  },
  {
    id: 680,
    title: "Idle Shark",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/idle-shark.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/idle-shark.html",
    isNew: false
  },
  {
    id: 681,
    title: "Infinite Craft",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/infinitecraft.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/infinitecraft.html",
    isNew: false
  },
  {
    id: 682,
    title: "Jelly Truck",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/jelly-truck.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/jelly-truck.html",
    isNew: false
  },
  {
    id: 683,
    title: "Just One Boss",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/just-one-boss.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/just-one-boss.html",
    isNew: false
  },
  {
    id: 684,
    title: "Knife Hit",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/knifehit.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/knifehit.html",
    isNew: false
  },
  {
    id: 685,
    title: "last Horizon",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/lasthorizon.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/lasthorizon.html",
    isNew: false
  },
  {
    id: 686,
    title: "lazy Jump 3d",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/lazyjump3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/lazyjump3d.html",
    isNew: false
  },
  {
    id: 687,
    title: "learn To Fly",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/learntofly.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/learntofly.html",
    isNew: false
  },
  {
    id: 688,
    title: "learn To Fly 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/learntofly2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/learntofly2.html",
    isNew: false
  },
  {
    id: 689,
    title: "learn to fly 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/learntofly3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/learntofly3.html",
    isNew: false
  },
  {
    id: 690,
    title: "line rider",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/linerider.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/linerider.html",
    isNew: false
  },
  {
    id: 691,
    title: "lows Adventures 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/lowsadventures2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/lowsadventures2.html",
    isNew: false
  },
  {
    id: 692,
    title: "Mario and Luigi: Superstar Saga",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/player#superstar.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/superstar",
    isNew: false
  },
  {
    id: 693,
    title: "Mario Kart: Super Circuit",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/player#mariokart.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/mariokart",
    isNew: false
  },
  {
    id: 694,
    title: "Pokemon Emerald",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pokemonemerald.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/player/#pokemonemerald",
    isNew: false
  },
  {
    id: 695,
    title: "Pokemon Green",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pokemongreen.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/player/#pokemongreen",
    isNew: false
  },
  {
    id: 696,
    title: "Pokemon Red",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pokemonred.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/player/#pokemonred",
    isNew: false
  },
  {
    id: 697,
    title: "Pokemon Sapphire",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pokemonsapphire.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/player/#pokemonsapphire",
    isNew: false
  },
  {
    id: 698,
    title: "Microsoft surf",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/surf.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/surf.html",
    isNew: false
  },
  {
    id: 699,
    title: "Minecraft 1.12.2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mc112.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mc112.html",
    isNew: false
  },
  {
    id: 700,
    title: "Minecraft 1.21.4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mc121.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mc121.html",
    isNew: false
  },
  {
    id: 701,
    title: "Monster Tracks",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/monstert.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/monstertracks.html",
    isNew: false
  },
  {
    id: 703,
    title: "Motox3m",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/motox3m.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/motox3m.html",
    isNew: false
  },
  {
    id: 704,
    title: "Motox3m 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/moto-x3m-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/moto-x3m-2.html",
    isNew: false
  },
  {
    id: 705,
    title: "Motox3m Pool Party",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/moto-x3m-pool-party.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/moto-x3m-pool-party.html",
    isNew: false
  },
  {
    id: 706,
    title: "Motox3m Spooky",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/motox3m-spooky.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/motox3m-spooky.html",
    isNew: false
  },
  {
    id: 707,
    title: "Mutilate A Doll 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/mad2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/mad2.html",
    isNew: false
  },
  {
    id: 708,
    title: "myTeardrop",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/play.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/teardrop/play.html",
    isNew: false
  },
  {
    id: 709,
    title: "Neon Rider",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/neonrider.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/neonrider.html",
    isNew: false
  },
  {
    id: 710,
    title: "Offline Paradise",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/OfflineParadise.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/OfflineParadise.html",
    isNew: false
  },
  {
    id: 711,
    title: "OMORI",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/omori.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/omori.html",
    isNew: false
  },
  {
    id: 712,
    title: "One Screen Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/one-screen-run.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/one-screen-run.html",
    isNew: false
  },
  {
    id: 713,
    title: "One Screen Run 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/one-screen-run-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/one-screen-run-2.html",
    isNew: false
  },
  {
    id: 714,
    title: "Osu!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/osu.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/osu.html",
    isNew: false
  },
  {
    id: 715,
    title: "Osu! Mania",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/osumania.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/osumania.html",
    isNew: false
  },
  {
    id: 716,
    title: "ovo",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ovo.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ovo.html",
    isNew: false
  },
  {
    id: 717,
    title: "Papa's Burgeria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/burger.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/papasburgeria.html",
    isNew: false
  },
  {
    id: 718,
    title: "Papa's Pizzaria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pizza.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/pizza.html",
    isNew: false
  },
  {
    id: 719,
    title: "Papas Pancakeria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/papas-pancakeria.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/papas-pancakeria.html",
    isNew: false
  },
  {
    id: 720,
    title: "Papas Wingeria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/papaswingeria.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/papaswingeria.html",
    isNew: false
  },
  {
    id: 721,
    title: "Papery Planes",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/papery-planes.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/papery-planes.html",
    isNew: false
  },
  {
    id: 722,
    title: "Pizza Tower",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pizza-tower.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/pizza-tower.html",
    isNew: false
  },
  {
    id: 723,
    title: "Plants vs Zombies",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pvz.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/pvz.html",
    isNew: false
  },
  {
    id: 724,
    title: "Pokemon: FireRed",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pokemonred.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/pokemonred",
    isNew: false
  },
  {
    id: 725,
    title: "Pokemon: LeafGreen",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/pokemongreen.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/pokemongreen",
    isNew: false
  },
  {
    id: 726,
    title: "Popcat Classic",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/popcat-classic.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/popcat-classic.html",
    isNew: false
  },
  {
    id: 727,
    title: "Portal Flash",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/portalflash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/portalflash.html",
    isNew: false
  },
  {
    id: 728,
    title: "Red Ball 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/redball3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/redball3.html",
    isNew: false
  },
  {
    id: 729,
    title: "Red Ball 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/redball4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/redball4.html",
    isNew: false
  },
  {
    id: 730,
    title: "Retro Bowl",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/retro-bowl.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/retro-bowl.html",
    isNew: false
  },
  {
    id: 731,
    title: "Rise-Of Neon Square",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rise-of-neon-square.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/rise-of-neon-square.html",
    isNew: false
  },
  {
    id: 732,
    title: "Ristar",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ristar.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/ristar.html",
    isNew: false
  },
  {
    id: 733,
    title: "Rocket Soccer Derby",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rocketleague.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/rocketleague.html",
    isNew: false
  },
  {
    id: 734,
    title: "Rooftop snipers",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rooftopsnipers.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/rooftopsnipers.html",
    isNew: false
  },
  {
    id: 735,
    title: "Rooftop snipers 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rooftopsnipers2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/rooftopsnipers2.html",
    isNew: false
  },
  {
    id: 736,
    title: "Run",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/run.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/run.html",
    isNew: false
  },
  {
    id: 737,
    title: "Run 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/run2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/run2.html",
    isNew: false
  },
  {
    id: 738,
    title: "Sand Game",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sand-game.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/sand-game.html",
    isNew: false
  },
  {
    id: 739,
    title: "Sandboxels",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sandboxels.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/sandboxels.html",
    isNew: false
  },
  {
    id: 740,
    title: "Short life 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/short-life-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/short-life-2.html",
    isNew: false
  },
  {
    id: 741,
    title: "Short Ride",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/short-ride.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/short-ride.html",
    isNew: false
  },
  {
    id: 742,
    title: "Sky Block",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/skyblock.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/skyblock.html",
    isNew: false
  },
  {
    id: 743,
    title: "Slope",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/slope.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/slope.html",
    isNew: false
  },
  {
    id: 744,
    title: "SM63",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sm63.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/sm63.html",
    isNew: false
  },
  {
    id: 745,
    title: "Smash Karts",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/smashk.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/smashk.html",
    isNew: false
  },
  {
    id: 746,
    title: "Snow Rider 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/rider.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/rider.html",
    isNew: false
  },
  {
    id: 747,
    title: "Sonic Advance",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sonic_advance.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/sonic_advance",
    isNew: false
  },
  {
    id: 748,
    title: "Sonic Advance 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sonic_advance2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/sonic_advance2",
    isNew: false
  },
  {
    id: 749,
    title: "Sonic Advance 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sonic_advance3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/sonic_advance3",
    isNew: false
  },
  {
    id: 750,
    title: "Sonic the Hedgehog",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sonic.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/sonic.html",
    isNew: false
  },
  {
    id: 751,
    title: "Space Invaders",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/spaceinvaders.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/spaceinvaders.html",
    isNew: false
  },
  {
    id: 752,
    title: "Spongebob Fiery Tracks Of Fury",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/fist.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/fist.html",
    isNew: false
  },
  {
    id: 753,
    title: "SpongeBob Patty Panic",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/panic.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/panic.html",
    isNew: false
  },
  {
    id: 754,
    title: "Spongebob: Belly Bounce",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/bounce.jpg",
    url: "bounce.html",
    isNew: false
  },
  {
    id: 755,
    title: "Stack Bump 3d",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/stack-bump-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/stack-bump-3d.html",
    isNew: false
  },
  {
    id: 756,
    title: "Stealing The Diamond",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/stealingthediamond.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/stealingthediamond.html",
    isNew: false
  },
  {
    id: 757,
    title: "Stickman Dismount",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/stickman-dismount.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/stickman-dismount.html",
    isNew: false
  },
  {
    id: 758,
    title: "Stickman Hook",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/stickman-hook.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/stickman-hook.html",
    isNew: false
  },
  {
    id: 759,
    title: "Stickman Survival",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/Stickman-Survival.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/Stickman-Survival.html",
    isNew: false
  },
  {
    id: 760,
    title: "Subway Surfers",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/subway.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/subway.html",
    isNew: false
  },
  {
    id: 761,
    title: "Super Brawl 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sb2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/sb2.html",
    isNew: false
  },
  {
    id: 762,
    title: "Super Mario 64",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/sm64.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sm64.html",
    isNew: false
  },
  {
    id: 763,
    title: "Super Mario Advance",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/supermarioadvance.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/supermarioadvance",
    isNew: false
  },
  {
    id: 764,
    title: "Super Mario Advance 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/supermarioadvance2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/supermarioadvance2",
    isNew: false
  },
  {
    id: 765,
    title: "Super Mario Advance 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/supermarioadvance3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/supermarioadvance3",
    isNew: false
  },
  {
    id: 766,
    title: "Super Mario Advance 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/supermarioadvance4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/supermarioadvance4",
    isNew: false
  },
  {
    id: 767,
    title: "Super Mario Flash",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/supermarioflash.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/supermarioflash.html",
    isNew: false
  },
  {
    id: 768,
    title: "Super Mario Flash 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/supermarioflash2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/supermarioflash2.html",
    isNew: false
  },
  {
    id: 769,
    title: "Super Mario Maker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/super-mario-maker-online.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/super-mario-maker-online.html",
    isNew: false
  },
  {
    id: 770,
    title: "Super Meat Boy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/supermeatboy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/supermeatboy.html",
    isNew: false
  },
  {
    id: 771,
    title: "Super Puffer Fish 3d",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/super-puffer-fish-3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/super-puffer-fish-3d.html",
    isNew: false
  },
  {
    id: 772,
    title: "Super Smash Flash",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ssf.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/ssf.html",
    isNew: false
  },
  {
    id: 773,
    title: "Tank Trouble 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tank-trouble-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/tank-trouble-2.html",
    isNew: false
  },
  {
    id: 774,
    title: "Tetris",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/tetris.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/tetris.html",
    isNew: false
  },
  {
    id: 775,
    title: "The Backrooms",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/backrooms.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/backrooms.html",
    isNew: false
  },
  {
    id: 776,
    title: "The Final Earth",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/the-final-earth.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/the-final-earth.html",
    isNew: false
  },
  {
    id: 777,
    title: "The Final Earth 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/the-final-earth-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/the-final-earth-2.html",
    isNew: false
  },
  {
    id: 778,
    title: "The Impossible Game",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/theimpossiblegame.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/theimpossiblegame.html",
    isNew: false
  },
  {
    id: 779,
    title: "The Impossible Quiz",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/the-impossible-quiz.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/the-impossible-quiz.html",
    isNew: false
  },
  {
    id: 780,
    title: "The Impossible Quiz 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/the-impossible-quiz-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/the-impossible-quiz-2.html",
    isNew: false
  },
  {
    id: 781,
    title: "The Simpsons: Road Rage",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/simpsons.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/gba/simpsons",
    isNew: false
  },
  {
    id: 782,
    title: "There is no game",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/there-is-no-game.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/there-is-no-game.html",
    isNew: false
  },
  {
    id: 783,
    title: "This Is The Only Level",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/thisistheonlylevel.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/thisistheonlylevel.html",
    isNew: false
  },
  {
    id: 784,
    title: "Traffic Jam 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/traffic3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/traffic3d.html",
    isNew: false
  },
  {
    id: 785,
    title: "Twinshot",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/twinshot.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/twinshot.html",
    isNew: false
  },
  {
    id: 786,
    title: "Twinshot 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/twinshot2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/twinshot2.html",
    isNew: false
  },
  {
    id: 787,
    title: "Ultimate Flash Sonic",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/ultimateflashsonic.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/ultimateflashsonic.html",
    isNew: false
  },
  {
    id: 788,
    title: "Unfair Mario",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/unfairmario.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/unfairmario.html",
    isNew: false
  },
  {
    id: 789,
    title: "Vex",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/vex.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/vex.html",
    isNew: false
  },
  {
    id: 790,
    title: "Vex 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/vex2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/vex2.html",
    isNew: false
  },
  {
    id: 791,
    title: "Vex 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/vex3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/vex3.html",
    isNew: false
  },
  {
    id: 792,
    title: "Vex 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/vex4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/vex4.html",
    isNew: false
  },
  {
    id: 793,
    title: "Vex 5",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/vex5.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/vex5.html",
    isNew: false
  },
  {
    id: 794,
    title: "Vex 6",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/vex6.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/vex6.html",
    isNew: false
  },
  {
    id: 795,
    title: "Vex 7",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/vex7.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/vex7.html",
    isNew: false
  },
  {
    id: 796,
    title: "Wolf 3d",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/wolf3d.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/wolf3d.html",
    isNew: false
  },
  {
    id: 797,
    title: "Worlds Hardest Game",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/worlds-hardest-game.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/worlds-hardest-game.html",
    isNew: false
  },
  {
    id: 798,
    title: "Worlds Hardest Game 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/worlds-hardest-game-2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/worlds-hardest-game-2.html",
    isNew: false
  },
  {
    id: 799,
    title: "xx142-b2exe",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/xx142-b2exe.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/xx142-b2exe.html",
    isNew: false
  },
  {
    id: 800,
    title: "Zombocalypse",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/zombocalypse.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/livediesmos/zombocalypse.html",
    isNew: false
  },
  {
    id: 801,
    title: "Zombotron",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/zombotron.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/zombotron.html",
    isNew: false
  },
  {
    id: 802,
    title: "Zombotron 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/images/zombotron2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/zombotron2.html",
    isNew: false
  },
{
    id: 803,
    title: "FNF: Heartbreak Havoc: Vs. Sky Redux",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/skyredux.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/redux.html",
    isNew: false
  },
    {
    id: 804,
    title: "1v1.lol",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/1v1lol.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/1v1lol.html",
    isNew: false
  },
    {
    id: 805,
    title: "Cave Story",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cavestory.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cavestory.html",
    isNew: false
  },
    {
    id: 806,
    title: "Peggle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/Peggle.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/Peggle.html",
    isNew: false
  },
    {
    id: 807,
    title: "Cooking Mama 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cookingmama2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cookingmama2.html",
    isNew: false
  },
    {
    id: 808,
    title: "Cooking Mama 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cookingmama3.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cookingmama3.html",
    isNew: false
  },
    {
    id: 809,
    title: "Crazy Cattle 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/crazycattle3d.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/crazycattle3d.html",
    isNew: false
  },
    {
    id: 810,
    title: "Dan the Man",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/dantheman.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/dantheman.html",
    isNew: false
  },
  {
    id: 811,
    title: "DEAD PLATE",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/deadplate.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/deadplate.html",
    isNew: false
  },
  {
    id: 812,
    title: "Duck Life 8",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/ducklife8.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/ducklife8.html",
    isNew: false
  },
  {
    id: 813,
    title: "Endroll",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/endroll.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/endroll.html",
    isNew: false
  },
  {
    id: 814,
    title: "Gladihoppers",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gladihoppers.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gladihoppers.html",
    isNew: false
  },
  {
    id: 815,
    title: "Fancy Pants Adventure 4 Part 1",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fancypants4p1.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fancypants4p1.html",
    isNew: false
  },
    {
    id: 816,
    title: "Fancy Pants Adventure 4 Part 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fancypants4p2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fancypants4p2.html",
    isNew: false
  },
  {
    id: 817,
    title: "Get Yoked",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/getyoked.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/getyoked.html",
    isNew: false
  },
    {
    id: 818,
    title: "Going Balls",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/goingballs.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/goingballs.html",
    isNew: false
  },
    {
    id: 819,
    title: "Growden.io",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/growdenio.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/growdenio.html",
    isNew: false
  },
    {
    id: 820,
    title: "Gorilla Tag",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gtag.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gtag.html",
    isNew: false
  },
    {
    id: 821,
    title: "Milk Inside a Bag of Milk inside a Bag of Milk",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/milkinside.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/milkinside.html",
    isNew: false
  },
    {
    id: 822,
    title: "Celeste",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/celeste.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/celeste.html",
    isNew: false
  },
    {
    id: 823,
    title: "Mindwave",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mindwave.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mindwave.html",
    isNew: false
  },
    {
    id: 824,
    title: "Newgrounds Rumble",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/newgroundsrumble.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/newgroundsrumble.html",
    isNew: false
  },
    {
    id: 825,
    title: "Oneshot",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/oneshot.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/oneshot.html",
    isNew: false
  },
    {
    id: 826,
    title: "Papa's Pastaria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papaspastaria.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papaspastaria.html",
    isNew: false
  },
    {
    id: 827,
    title: "Pico's School",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/picoschool.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/picoschool.html",
    isNew: false
  },
    {
    id: 828,
    title: "Madness Combat: Project Nexus",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/projectnexus.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/projectnexus.html",
    isNew: false
  },
{
    id: 829,
    title: "Plants vs. Zombies 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pvz2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pvz2.html",
    isNew: false
  },
   {
    id: 830,
    title: "Slime Rancher",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/slimerancher.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/slimerancher.html",
    isNew: false
  }, 
    {
    id: 831,
    title: "Steal Brainrot Online",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stealbrainrot.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stealbrainrot.html",
    isNew: true
  },
    {
    id: 832,
    title: "WebFishing",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/webfishing.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/webfishing.html",
    isNew: false
  },
    {
    id: 833,
    title: "BFDI Branches",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bfdibranches.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bfdibranches.html",
    isNew: false
  },
    {
    id: 834,
    title: "We Become What We Behold",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/behold.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/behold.html",
    isNew: false
},
{
    id: 837,
    title: "Slow Roads",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/slowroads.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/slowroads.html",
    isNew: false
},
{
    id: 838,
    title: "Phoenix Wright: Ace Attorney",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/aceattorney.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/aceattorney.html",
    isNew: false
},
{
    id: 839,
    title: "Phoenix Wright: Justice for All",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/phoenixjusticeforall.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/phoenixjusticeforall.html",
    isNew: false
},
{
    id: 840,
    title: "Phoenix Wright: Trials and Tribulations",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/phoenixtrials.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/phoenixtrials.html",
    isNew: false
},
{
    id: 841,
    title: "Mario & Luigi: Partners in Time",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/partnersintime.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/partnersintime.html",
    isNew: false
},
{
    id: 842,
    title: "Mario & Luigi: Bowser's Inside Story",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/insidestory.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/insidestory.html",
    isNew: false
},
{
    id: 843,
    title: "Super Mario Bros",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermariobros.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermariobros.html",
    isNew: false
},
{
    id: 844,
    title: "Super Mario Bros 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermariobros2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermariobros2.html",
    isNew: false
},
{
    id: 845,
    title: "Super Mario Bros 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermariobros3.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermariobros3.html",
    isNew: false
},
{
    id: 846,
    title: "Scooby-Doo! Mystery Mayhem",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/scoobydoogba.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/scoobydoogba.html",
    isNew: false
},
{
    id: 847,
    title: "The SpongeBob Squarepants Movie",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sbmoviegba.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sbmoviegba.html",
    isNew: false
},
{
    id: 848,
    title: "Subway Surfers Berlin",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/subwaysurfers.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/subwaysurfersberlin.html",
    isNew: false
},
{
    id: 849,
    title: "Subway Surfers London",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/subwaysurfers.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/subwaysurferslondon.html",
    isNew: false
},
{
    id: 850,
    title: "Subway Surfers Mexico",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/subwaysurfers.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/subwaysurfersmexico.html",
    isNew: false
},
{
    id: 851,
    title: "Subway Surfers Beijing",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/subwaysurfers.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/subwaysurfersbeijing.html",
    isNew: false
},
{
    id: 852,
    title: "Super Mario All-Stars",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermarioallstars.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermarioallstars.html",
    isNew: false
},
{
    id: 853,
    title: "Super Mario RPG",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermariorpg.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermariorpg.html",
    isNew: false
},
{
    id: 854,
    title: "Sonic Mega Mix",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicmegamix.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicmegamix.html",
    isNew: false
},
{
    id: 855,
    title: "Sonic Classic Heroes",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicclassicheroes.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicclassicheroes.html",
    isNew: false
},
{
    id: 856,
    title: "Sonic Spinball",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicspinball.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicspinball.html",
    isNew: false
},
{
    id: 857,
    title: "Super Punch-Out!!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/superpunchout.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/superpunchout.html",
    isNew: false
},
{
    id: 858,
    title: "Big Ice Tower Tiny Square",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigicetowertinysquare.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigicetowertinysquare.html",
    isNew: false
},
{
    id: 859,
    title: "Big Neon Tower Tiny Square",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigneontowertinysquare.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigneontowertinysquare.html",
    isNew: false
},
{
    id: 860,
    title: "Big Tower Tiny Square 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigtowertinysquare2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigtowertinysquare2.html",
    isNew: false
},
{
    id: 861,
    title: "FIFA 10",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fifa10.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fifa10.html",
    isNew: false
},
{
    id: 862,
    title: "FIFA 11",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fifa11.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fifa11.html",
    isNew: false
},
{
    id: 863,
    title: "Big City Battle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigcitybattle.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigcitybattle.html",
    isNew: false
},
{
    id: 864,
    title: "Bergentruck 201X",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bergentruck201x.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bergentruck201x.html",
    isNew: false
},
{
    id: 865,
    title: "Puyo Pop Fever",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/puyopuyofever.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/puyopuyofever.html",
    isNew: false
},
{
    id: 866,
    title: "Goat Guardian",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/goatguardian.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/goatguardian.html",
    isNew: false
},
{
    id: 867,
    title: "Sprunki",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sprunki.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sprunki.html",
    isNew: false
},
{
    id: 868,
    title: "Sprunki Clicker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sprunkiclicker.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sprunkiclicker.html",
    isNew: false
},
{
    id: 869,
    title: "You vs 100 Skibidi Toilets",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/youvs100skibidi.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/youvs100skibidi.html",
    isNew: false
},
{
    id: 870,
    title: "Whack the Creeps",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/whackthecreeps.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/whackthecreeps.html",
    isNew: false
},
{
    id: 871,
    title: "Whack Your Boss",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/whackyourboss.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/whackyourboss.html",
    isNew: false
},
{
    id: 872,
    title: "Whack Your Computer",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/whackyourcomputer.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/whackyourcomputer.html",
    isNew: false
},
{
    id: 873,
    title: "Whack Your Ex",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/whackyourex.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/whackyourex.html",
    isNew: false
},
{
    id: 874,
    title: "Housebroken Hero",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/housebrokenhero.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/housebrokenhero.html",
    isNew: false
},
    {
    id: 875,
    title: "Animal Crossing: Wild World",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/animalcrossingwildworld.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/animalcrossingwildworld.html",
    isNew: false
},
{
    id: 876,
    title: "Ant Buster",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/antbuster.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/antbuster.html",
    isNew: false
},
{
    id: 877,
    title: "The Amazing World of Gumball: Blindfooled",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/blindfooled.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/blindfooled.html",
    isNew: false
},
{
    id: 878,
    title: "SpongeBob Squarepants: Boo or Boom",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/booorboom.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/booorboom.html",
    isNew: false
},
{
    id: 879,
    title: "BuildNow.gg",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/buildnowgg.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/buildnowgg.html",
    isNew: false
},
{
    id: 880,
    title: "Capybara Clicker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/capybaraclicker.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/capybaraclicker.html",
    isNew: false
},
{
    id: 882,
    title: "SpongeBob Squarepants: Delivery Dilemma",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/deliverydilemma.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/deliverydilemma.html",
    isNew: false
},
{
    id: 883,
    title: "Deltatraveler",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/deltatraveler.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/deltatraveler.html",
    isNew: false
},
{
    id: 884,
    title: "Donkey Kong Country",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/donkeykongcountry.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/donkeykongcountry.html",
    isNew: false
},
{
    id: 885,
    title: "Driven Wild",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/drivenwild.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/drivenwild.html",
    isNew: false
},
{
    id: 886,
    title: "FortZone Battle Royale",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fortzonebattleroyale.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fortzonebattleroyale.html",
    isNew: false
},
{
    id: 887,
    title: "Grand Action Simulator: New York",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/grandactionsimulatorny.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/grandactionsimulatorny.html",
    isNew: false
},
{
    id: 888,
    title: "GTA: Vice City",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gtavicecity.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gtavicecity.html",
    isNew: false
},
{
    id: 889,
    title: "Half-Life",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/halflife.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/halflife.html",
    isNew: false
},
{
    id: 890,
    title: "Nickelodeon: Hardest Game Ever",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/hardestgameever.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/hardestgameever.html",
    isNew: false
},
{
    id: 891,
    title: "Highway Racer",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/highwayracer.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/highwayracer.html",
    isNew: false
},
{
    id: 892,
    title: "Kitty Toy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kittytoy.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kittytoy.html",
    isNew: false
},
{
    id: 893,
    title: "Look Outside",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/lookoutside.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/lookoutside.html",
    isNew: false
},
{
    id: 894,
    title: "Mario Kart DS",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mariokartds.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mariokartds.html",
    isNew: false
},
{
    id: 895,
    title: "Mario Party DS",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mariopartyds.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mariopartyds.html",
    isNew: false
},
{
    id: 896,
    title: "Nintendogs: Labrador & Friends",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/nintendogslab.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/nintendogslab.html",
    isNew: false
},
{
    id: 897,
    title: "Pizza Tower: Scoutdigo",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pizzatowerscoutdigo.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pizzatowerscoutdigo.html",
    isNew: false
},
{
    id: 898,
    title: "SpongeBob Squarepants: Pyramid Peril",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pyramidperil.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pyramidperil.html",
    isNew: false
},
{
    id: 899,
    title: "Sandtris",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sandtris.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sandtris.html",
    isNew: false
},
{
    id: 900,
    title: "SpongeBob Squarepants: Sea Monster Smoosh",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/seamonstersmoosh.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/seamonstersmoosh.html",
    isNew: false
},
{
    id: 902,
    title: "Sonic CD",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/soniccd.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/soniccd.html",
    isNew: false
},
{
    id: 903,
    title: "Sonic Colors",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/soniccolors.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/soniccolors.html",
    isNew: false
},
{
    id: 904,
    title: "Sonic.exe",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicexe.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicexe.html",
    isNew: false
},
{
    id: 905,
    title: "Sonic Mania",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicmania.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicmania.html",
    isNew: false
},
{
    id: 906,
    title: "Sonic Rush",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicrush.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicrush.html",
    isNew: false
},
{
    id: 907,
    title: "Super Mario World",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermarioworld.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermarioworld.html",
    isNew: false
},
{
    id: 908,
    title: "Super Mario World 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermarioworld2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermarioworld2.html",
    isNew: false
},
{
    id: 909,
    title: "Super Princess Peach",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/superprincesspeach.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/superprincesspeach.html",
    isNew: false
},
{
    id: 910,
    title: "Traffic Rider",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/trafficrider.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/trafficrider.html",
    isNew: false
},
    {
    id: 911,
    title: "FNF: Sonic Dash And Spin",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicdashandspin.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/sonicdashandspin.html",
    isNew: false
},
        {
    id: 912,
    title: "FNF: CN Lost Episodes",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/cnlost.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/fnf/cnlost.html",
    isNew: false
},
        {
    id: 913,
    title: "Choose Your Weapon",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chooseyourweapon.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chooseyourweapon.html",
    isNew: false
},
        {
    id: 914,
    title: "Choose Your Weapon 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chooseyourweapon2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chooseyourweapon2.html",
    isNew: false
},
        {
    id: 915,
    title: "Choose Your Weapon 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chooseyourweapon3.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/whatver/chooseyourweapon3.html",
    isNew: false
},
         {
    id: 916,
    title: "FNF: Vs. Jeffy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/images/jeffy.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/jeffy.html",
    isNew: false
             },
         {
    id: 917,
    title: "Wheely",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheel.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheely.html",
    isNew: false
             },
       {
    id: 918,
    title: "Wheely 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheel2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheely2.html",
    isNew: false
             },
       {
    id: 919,
    title: "Wheely 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheel3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheely3.html",
    isNew: false
             },
       {
    id: 920,
    title: "Wheely 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheel4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheely4.html",
    isNew: false
             },
       {
    id: 921,
    title: "Wheely 5",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheel5.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheely5.html",
    isNew: false
             },
       {
    id: 922,
    title: "Wheely 6",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheel6.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheely6.html",
    isNew: false
             },
       {
    id: 923,
    title: "Wheely 7",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheel7.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheely7.html",
    isNew: false
             },
       {
    id: 924,
    title: "Wheely 8",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheel8.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wheely8.html",
    isNew: false
             },
         {
    id: 925,
    title: "Sonic Revert",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/revert.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicrevert.html",
    isNew: false
},
     {
    id: 926,
    title: "Drive Mad",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/drivemad.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/drivemad.html",
    isNew: false
},
     {
    id: 927,
    title: "Papers.io Mania",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papermania.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/paperiomania.html",
    isNew: false
},
     {
    id: 928,
    title: "Granny",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/granny.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/granny.html",
    isNew: false
},
  {
    id: 929,
    title: "FNAF",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fnaf.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/FNAF.html",
    isNew: false
},
  {
    id: 930,
    title: "FNAF 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fnaf2.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/FNAF2.html",
    isNew: false
},
  {
    id: 931,
    title: "FNAF 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fnaf3.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/FNAF3.html",
    isNew: false
},
  {
    id: 932,
    title: "FNAF 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fnaf4.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/FNAF4.html",
    isNew: false
},
{
    id: 933,
    title: "Parappa The Rapper",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/parappa.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/parappatherapper.html",
    isNew: false
},
{
    id: 934,
    title: "Omega Nugget Clicker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/omega.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/omeganuggetclicker.html",
    isNew: false
},
{
    id: 935,
    title: "Room Clicker",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/room.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/roomclicker.html",
    isNew: false
},
{
    id: 936,
    title: "Minecraft Pocket Edition 0.6.1",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mcpe.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mcpe.html",
    isNew: false
},
     {
    id: 937,
    title: "FNF: CITYFUNK",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cityfunk.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/cityfunk.html",
    isNew: false
},
             {
    id: 938,
    title: "FNF: Jeffy's Infinite Irida (SHUCKS DEMO)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/irida.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/irida.html",
    isNew: false
},
{
    id: 939,
    title: "Antonblast",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/antonblast.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/antonblast.html",
    isNew: false
},
{
    id: 940,
    title: "Jumbo Mario",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/jumbomario.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/jumbomario.html",
    isNew: false
},
{
    id: 941,
    title: "Needy Streamer Overload",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/needystreameroverload.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/needystreameroverload.html",
    isNew: false
},
{
    id: 942,
    title: "Bart Blast",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bartblast.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bartblast.html",
    isNew: false
},
{
    id: 943,
    title: "Kirby ~ Soft and Wet",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kirbysoftandwet.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kirbysoftandwet.html",
    isNew: false
},
{
    id: 944,
    title: "Tetris",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/tetris.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/tetris.html",
    isNew: false
},
{
    id: 945,
    title: "Five Nights at Epstein's",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fivenightsatepsteins.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fivenightsatepsteins.html",
    isNew: false
},
{
    id: 946,
    title: "Survivor.io",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/survivorio.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/survivorio.html",
    isNew: false
},
{
    id: 947,
    title: "FNF: Vs. Rewrite: Round 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/rewriteround2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/rewriteround2.html",
    isNew: false
},
{
    id: 948,
    title: "In Stars and Time",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/instarsandtime.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/instarsandtime.html",
    isNew: false
},
{
    id: 949,
    title: "FNF: Vs. Impostor (2025): UPDOG",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/updog.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/updog.html",
    isNew: false
},
{
    id: 950,
    title: "FNF: Vs Mouse: Rookies Edition (Disk 1)",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mouse-rookies.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mouse-rookies.html",
    isNew: false
},
{
    id: 951,
    title: "FNF: Anemaniac – Bendy vs Ollie",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/anemaniac.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/anemaniac.html",
    isNew: false
},  
{
    id: 952,
    title: "FNF: Sky: REBORN",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/skyreborn.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/skyreborn.html",
    isNew: false
},  
{
    id: 953,
    title: "FNF: Funkin’ on the Heights!",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/funkinheights.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/funkinheights.html",
    isNew: false
}, 
{
    id: 954,
    title: "FNF: DOCAD: 2-shot Demo",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/docad.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/docad.html",
    isNew: false
},  
{
    id: 955,
    title: "FNF: Annoying Orange: The Amazing Grace V2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/rottensmoothie.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/rottensmoothie.html",
    isNew: false
},
{
    id: 956,
    title: "awesome calculator",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/awesomecalculator.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/awesomecalculator.html",
    isNew: false
},
    {
    id: 957,
    title: "Bloxorz",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloxorz.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloxorz.html",
    isNew: false
},
{
    id: 958,
    title: "Crazy Chicken 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/crazychicken3d.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/crazychicken3d.html",
    isNew: false
},
{
    id: 959,
    title: "Crazy Kitty 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/crazykitty3d.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/crazykitty3d.html",
    isNew: false
},
{
    id: 960,
    title: "Getting Over It with Bennett Foddy",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gettingoverit.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gettingoverit.html",
    isNew: false
},
{
    id: 961,
    title: "Hotline Miami",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/hotlinemiami.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/hotlinemiami.html",
    isNew: false
},
{
    id: 962,
    title: "Minecraft 1.5.2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mc152.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mc152.html",
    isNew: false
},
{
    id: 963,
    title: "Minecraft Alpha 1.2.6",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mcalpha126.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mcalpha126.html",
    isNew: false
},
{
    id: 964,
    title: "Minecraft Beta 1.3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mcbeta13.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/mcbeta13.html",
    isNew: false
},
{
    id: 966,
    title: "Tomb of the Mask",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/tombofthemask.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/tombofthemask.html",
    isNew: false
},
{
    id: 967,
    title: "Toss the Turtle",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/tosstheturtle.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/tosstheturtle.html",
    isNew: false
},
{
    id: 968,
    title: "Touhou: Luminous Strike",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/touhouluminousstrike.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/touhouluminousstrike.html",
    isNew: false
},
{
    id: 969,
    title: "Undertale: Last Breath",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/undertalelastbreath.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/undertalelastbreath.html",
    isNew: false
},
{
    id: 970,
    title: "Balatro",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/balatro.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/balatro.html",
    isNew: false
},
{
    id: 971,
    title: "A Random Bee Swarm Simulator Knockoff",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bee.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bee.html",
    isNew: false
},
{
    id: 972,
    title: "Baseball Bros",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/baseballbros.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/baseballbros.html",
    isNew: false
},
{
    id: 973,
    title: "Big Flappy Tower Tiny Square",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigflappytowertinysquare.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bigflappytowertinysquare.html",
    isNew: false
},
{
    id: 974,
    title: "Bloons 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloons2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloons2.html",
    isNew: false
},
{
    id: 975,
    title: "Bloons Tower Defense 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonsTD3.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonsTD3.html",
    isNew: false
},
{
    id: 976,
    title: "Bloons Tower Defense 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonsTD4.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonsTD4.html",
    isNew: false
},
{
    id: 977,
    title: "Bloons Tower Defense 5",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonsTD5.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonsTD5.html",
    isNew: false
},
{
    id: 978,
    title: "Bloons Player Pack 1",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp1.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp1.html",
    isNew: false
},
{
    id: 979,
    title: "Bloons Player Pack 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp2.html",
    isNew: false
},
{
    id: 980,
    title: "Bloons Player Pack 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp3.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp3.html",
    isNew: false
},
{
    id: 981,
    title: "Bloons Player Pack 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp4.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp4.html",
    isNew: false
},
{
    id: 982,
    title: "Bloons Player Pack 5",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp5.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonspp5.html",
    isNew: false
},
{
    id: 983,
    title: "Bowmasters",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bowmasters.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bowmasters.html",
    isNew: false
},
{
    id: 984,
    title: "Candy Crush",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/candycrush.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/candycrush.html",
    isNew: false
},
{
    id: 985,
    title: "Drift Cup Racing",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/driftcupracing.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/driftcupracing.html",
    isNew: false
},
{
    id: 986,
    title: "Jacksmith",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/jacksmith.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/jacksmith.html",
    isNew: false
},
{
    id: 987,
    title: "Jungle Bubble",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/junglebubble.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/junglebubble.html",
    isNew: false
},
{
    id: 988,
    title: "Memo Matcher",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/memomatcher.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/memomatcher.html",
    isNew: false
},
{
    id: 989,
    title: "Papa's Bakeria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papasbakeria.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papasbakeria.html",
    isNew: false
},
{
    id: 990,
    title: "Papa's Cheeseria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papascheeseria.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papascheeseria.html",
    isNew: false
},
{
    id: 991,
    title: "Papa's Donuteria",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papasdonuteria.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papasdonuteria.html",
    isNew: false
},
{
    id: 992,
    title: "Papa's Scooperia",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papasscooperia.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papasscooperia.html",
    isNew: false
},
{
    id: 993,
    title: "Papa's Taco Mia",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papastacomia.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/papastacomia.html",
    isNew: false
},
{
    id: 994,
    title: "Potatoman Seeks the Troof",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/potatomanseeksthetroof.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/potatomanseeksthetroof.html",
    isNew: false
},
{
    id: 995,
    title: "Riddle School",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool.html",
    isNew: false
},
{
    id: 996,
    title: "Riddle School 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool2.html",
    isNew: false
},
{
    id: 997,
    title: "Riddle School 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool3.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool3.html",
    isNew: false
},
{
    id: 998,
    title: "Riddle School 4",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool4.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool4.html",
    isNew: false
},
{
    id: 999,
    title: "Riddle School 5",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool5.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddleschool5.html",
    isNew: false
},
{
    id: 1000,
    title: "Riddle Transfer",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddletransfer.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddletransfer.html",
    isNew: false
},
{
    id: 1001,
    title: "Riddle Transfer 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddletransfer2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/riddletransfer2.html",
    isNew: false
},
{
    id: 1002,
    title: "Solar Smash",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/solarsmash.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/solarsmash.html",
    isNew: false
},
      {
    id: 1003,
    title: "Awesome Tanks",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/awesometanks.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/awesometanks.html",
    isNew: false
},
{
    id: 1004,
    title: "Awesome Tanks 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/awesometanks2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/awesometanks2.html",
    isNew: false
},
    {
    id: 1005,
    title: "Among Rampage",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/amongrampage.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/amongrampage.html",
    isNew: false
},
{
    id: 1006,
    title: "Doom",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/doom.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/doom.html",
    isNew: false
},
{
    id: 1007,
    title: "Doom II",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/doom2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/doom2.html",
    isNew: false
},
{
    id: 1008,
    title: "Doom III",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/doom3.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/doom3.html",
    isNew: false
},
{
    id: 1009,
    title: "Dumb Ways to Die",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/dumbwaystodie.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/dumbwaystodie.html",
    isNew: false
},
{
    id: 1010,
    title: "Fallout",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fallout.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fallout.html",
    isNew: false
},
{
    id: 1011,
    title: "Kindergarten",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kindergarten.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kindergarten.html",
    isNew: false
},
{
    id: 1012,
    title: "Kindergarten 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kindergarten2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kindergarten2.html",
    isNew: false
},
{
    id: 1013,
    title: "Kindergarten 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kindergarten3.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/kindergarten3.html",
    isNew: false
},
{
    id: 1014,
    title: "OFF",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/off.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/off.html",
    isNew: false
},
{
    id: 1015,
    title: "Touhou Mother",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/touhoumother.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/touhoumother.html",
    isNew: false
},
{
    id: 1016,
    title: "Trivia Crack",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/triviacrack.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/triviacrack.html",
    isNew: false
},
{
    id: 1017,
    title: "Gacha Life",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gachalife.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gachalife.html",
    isNew: false
},
{
    id: 1018,
    title: "Gachaverse",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gachaverse.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gachaverse.html",
    isNew: false
},
{
    id: 1019,
    title: "FNF: Vs Forsaken: DEMO",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/forsaken.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/forsaken.html",
    isNew: false
},
{
    id: 1020,
    title: "FNF: Throwback",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/throwback.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/throwback.html",
    isNew: false
},
{
    id: 1021,
    title: "Ace Attorney Investigations",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/aceattorneyinvestigations.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/aceattorneyinvestigations.html",
    isNew: false
},
{
    id: 1022,
    title: "Bloons Insanity Pack",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonsinsanitypack.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/bloonsinsanitypack.html",
    isNew: false
},
{
    id: 1023,
    title: "Dad n' Me",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/dadnme.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/dadnme.html",
    isNew: false
},
{
    id: 1024,
    title: "Gravity Duck",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gravityduck.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gravityduck.html",
    isNew: false
},
{
    id: 1025,
    title: "Gravity Duck 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gravityduck2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gravityduck2.html",
    isNew: false
},
{
    id: 1026,
    title: "Halloween Jam",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/halloweenjam.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/halloweenjam.html",
    isNew: false
},
{
    id: 1027,
    title: "NG's Finest",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/ngsfinest.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/ngsfinest.html",
    isNew: false
},
{
    id: 1028,
    title: "Nyan Cat Lost in Space",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/nyancatlostinspace.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/nyancatlostinspace.html",
    isNew: false
},
{
    id: 1029,
    title: "Patapon Beat Camp",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pataponbeatcamp.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pataponbeatcamp.html",
    isNew: false
},
{
    id: 1030,
    title: "Pet Zombie",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/petzombie.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/petzombie.html",
    isNew: false
},
{
    id: 1031,
    title: "Pico's School: Love Conquers All",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/picosschoolloveconquersall.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/picosschoolloveconquersall.html",
    isNew: false
},
{
    id: 1032,
    title: "Pocket Emo",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pocketemo.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/pocketemo.html",
    isNew: false
},
{
    id: 1033,
    title: "Stick Figure Badminton",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stickfigurebadminton.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stickfigurebadminton.html",
    isNew: false
},
{
    id: 1034,
    title: "Stick Figure Badminton 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stickfigurebadminton2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stickfigurebadminton2.html",
    isNew: false
},
{
    id: 1035,
    title: "Stick Figure Badminton 3",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stickfigurebadminton3.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stickfigurebadminton3.html",
    isNew: false
},
{
    id: 1036,
    title: "Strike Force Kitty",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/strikeforcekitty.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/strikeforcekitty.html",
    isNew: false
},
{
    id: 1037,
    title: "Strike Force Kitty 2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/strikeforcekitty2.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/strikeforcekitty2.html",
    isNew: false
},
{
    id: 1038,
    title: "Strike Force Kitty Last Stand",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/strikeforcekittylaststand.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/strikeforcekittylaststand.html",
    isNew: false
},
{
    id: 1039,
    title: "Super Monkey Ball 1/2",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermonkeyball12.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/supermonkeyball12.html",
    isNew: false
},
{
    id: 1040,
    title: "SpongeBob SquarePants: Trail of the Snail",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/trailofthesnail.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/trailofthesnail.html",
    isNew: false
},
    {
    id: 1041,
    title: "Geometry Dash: Subzero",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gdsubzero.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/gdsubzero.html",
    isNew: false
},
{
    id: 1042,
    title: "Hill Climb Racing Lite",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/hillclimbracinglite.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/hillclimbracinglite.html",
    isNew: false
},
{
    id: 1043,
    title: "Huggy Wuggy Pixel Nights",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/huggywuggypixelnights.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/huggywuggypixelnights.html",
    isNew: false
},
{
    id: 1044,
    title: "RocketGoal.io",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/rocketgoalio.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/rocketgoalio.html",
    isNew: false
},
{
    id: 1045,
    title: "Stick With It",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stickwithit.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/stickwithit.html",
    isNew: false
},
{
    id: 1046,
    title: "Wolfenstein 3D",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wolfenstein.png",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/wolfenstein.html",
    isNew: false
},
{
    id: 1047,
    title: "A Random Clicker By Jalen",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/arandomclicker.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/arandomclicker.html",
    isNew: false
},
{
    id: 1048,
    title: "Sonic Mania Plus",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicmaniaplus.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/sonicmaniaplus.html",
    isNew: false
},
{
    id: 1049,
    title: "FNF: Remnants",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fnfremnants.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/fnfremnants.html",
    isNew: false
},
{
    id: 1050,
    title: "Jelly Mario",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/jellymario.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/jellymario.html",
    isNew: false
},
{
    id: 1051,
    title: "School Boy Runaway",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/schoolboyrunaway.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/schoolboyrunaway.html",
    isNew: true
},
{
    id: 1052,
    title: "Epsteins Education And Learning",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/baldiepstein.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/baldiepstein.html",
    isNew: false
},
{
    id: 1053,
    title: "CaseOhs Education And Learning",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/baldicaseoh.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/baldicaseoh.html",
    isNew: false
},
{
    id: 1054,
    title: "FNF: Hazier River",
    image: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/hazier.jpg",
    url: "https://testingcf.jsdelivr.net/gh/aDiesmos/HTMLFILES/2026uploads/hazier.html",
    isNew: true
},
];

const gamesGrid = document.getElementById('gamesGrid');
const favoritesContainer = document.getElementById('favoritesContainer');
const gameCount = document.getElementById('gameCount');
const searchBar = document.getElementById('searchBar');
const filterButtons = document.querySelectorAll('.filter-btn');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');


const gameOverlay = document.getElementById('gameOverlay');
const gameIframe = document.getElementById('gameIframe');
const iframeContainer = document.getElementById('gameIframeContainer');
const overlayGameTitle = document.getElementById('overlayGameTitle');
const closeOverlayBtn = document.getElementById('closeOverlayBtn');
const gameLoading = document.getElementById('gameLoading');
const gameError = document.getElementById('gameError');
const retryBtn = document.getElementById('retryBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const downloadGameBtn = document.getElementById('downloadGameBtn');
const cookieFileInput = document.getElementById('cookieFileInput');
const musicAudio = document.getElementById('musicAudio');
const musicFilePicker = document.getElementById('musicFilePicker');
const musicPlayPauseBtn = document.getElementById('musicPlayPauseBtn');
const musicLoopBtn = document.getElementById('musicLoopBtn');
const musicUploadBtn = document.getElementById('musicUploadBtn');
const musicTrackLabel = document.getElementById('musicTrackLabel');
const musicArtistLabel = document.getElementById('musicArtistLabel');
const musicAlbumLabel = document.getElementById('musicAlbumLabel');
const musicDetailsLabel = document.getElementById('musicDetailsLabel');
const musicStatus = document.getElementById('musicStatus');
const visualizerCanvas = document.getElementById('visualizerCanvas');


let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentFilter = 'all';
let searchQuery = '';
let currentGame = null;
let currentGameUrl = '';
let currentPage = 1;
const GAMES_PER_PAGE = 100;
let filteredGames = [];
let errorTimeout = null;
let lastError = null;
let iframeLoadTimeout = null;
let previousBlobUrl = null;
let overlayCloseTimeout = null;
let activeTiltCard = null;
let musicAudioContext = null;
let musicAnalyser = null;
let musicSourceNode = null;
let visualizerFrame = null;
let currentMusicUrl = null;
let currentMusicMeta = null;


document.addEventListener('DOMContentLoaded', () => {
  
  translateAllGameUrls();
  
  
  sortGamesAlphabetically();
  
  refreshGameViews();
  setupEventListeners();
  updateGreeting();
  createHearts();
  setupPagination();
  setupMusicPlayer();
  refreshGameViews();
});

function openSiteInNewTab() {
  
  const newTab = window.open('about:blank', '_blank');
  if (!newTab) {
    alert('Popup blocked  Please allow popups for this site.');
    return;
  }

  
  const fullHtml = `
<!DOCTYPE html>
${document.documentElement.outerHTML}
  `;

  
  newTab.document.open();
  newTab.document.write(fullHtml);
  newTab.document.close();
}


function translateAllGameUrls() {
  games.forEach(game => {
    
    game.translatedImage = translateImageUrl(game.image);
    
    
    game.translatedUrl = translateGameUrl(game.url);
  });
}


function sortGamesAlphabetically() {
  games.sort((a, b) => a.title.localeCompare(b.title));
}


function filterAndSortGames() {
  filteredGames = games.filter(game => {
    const matchesFilter = currentFilter === 'all' || 
                         (currentFilter === 'new' && game.isNew);
    
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  
  currentPage = 1;
}

function refreshGameViews(options = {}) {
  const { preservePage = false } = options;
  const previousPage = currentPage;

  favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  filterAndSortGames();

  if (preservePage) {
    currentPage = Math.min(previousPage, Math.max(getTotalPages(), 1));
  }

  renderGames();
  updateGameCount();
  renderFavorites();
}


function getGamesForCurrentPage() {
  const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
  const endIndex = startIndex + GAMES_PER_PAGE;
  return filteredGames.slice(startIndex, endIndex);
}


function getTotalPages() {
  return Math.ceil(filteredGames.length / GAMES_PER_PAGE);
}

function createPaginationControls(extraClass = '') {
  const paginationContainer = document.createElement('div');
  paginationContainer.className = `pagination ${extraClass}`.trim();

  const prevBtn = document.createElement('button');
  prevBtn.className = 'filter-btn';
  prevBtn.innerHTML = '&larr; Previous';
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderGames();
      updatePagination();
    }
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'filter-btn';
  nextBtn.innerHTML = 'Next &rarr;';
  nextBtn.addEventListener('click', () => {
    if (currentPage < getTotalPages()) {
      currentPage++;
      renderGames();
      updatePagination();
    }
  });

  const pageInfo = document.createElement('span');
  pageInfo.className = 'page-info';

  paginationContainer.appendChild(prevBtn);
  paginationContainer.appendChild(pageInfo);
  paginationContainer.appendChild(nextBtn);

  return { container: paginationContainer, prevBtn, nextBtn, pageInfo };
}


function setupPagination() {
  const topHost = document.getElementById('topPagination');
  const topControls = createPaginationControls('pagination-top');
  const bottomControls = createPaginationControls();

  if (topHost) {
    topHost.innerHTML = '';
    topHost.appendChild(topControls.container);
  }

  gamesGrid.parentNode.appendChild(bottomControls.container);
  const prevBtn = document.createElement('button');
  prevBtn.className = 'filter-btn';
  prevBtn.innerHTML = '← Previous';
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderGames();
      updatePagination();
    }
  });
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'filter-btn';
  nextBtn.innerHTML = 'Next →';
  nextBtn.addEventListener('click', () => {
    if (currentPage < getTotalPages()) {
      currentPage++;
      renderGames();
      updatePagination();
    }
  });
  
  const pageInfo = document.createElement('span');
  pageInfo.className = 'page-info';
  pageInfo.style.cssText = `
    color: var(--valentine-pink);
    font-weight: 500;
    min-width: 150px;
    text-align: center;
  `;
  
  paginationContainer.appendChild(prevBtn);
  paginationContainer.appendChild(pageInfo);
  paginationContainer.appendChild(nextBtn);

  window.paginationElements = {
    groups: [topControls, bottomControls]
  };
  
  updatePagination();
}


function updatePagination() {
  if (!window.paginationElements) return;
  const totalPages = getTotalPages();

  window.paginationElements.groups.forEach(({ prevBtn, nextBtn, pageInfo, container }) => {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    container.style.display = 'flex';
  });
}


function renderGames() {
  gamesGrid.innerHTML = '';
  
  const pageGames = getGamesForCurrentPage();
  
  if (pageGames.length === 0) {
    gamesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>No games found matching your search. </p>
        <p style="margin-top: 1rem;">Try a different search or check the next page!</p>
      </div>
    `;
    return;
  }
  
  pageGames.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = `game-card ${game.isNew ? 'new' : ''}`;
    gameCard.setAttribute('data-game-id', game.id);
    gameCard.innerHTML = `
      <div class="game-card-visual">
      <img src="${game.translatedImage || game.image}" alt="${game.title}" class="game-image" loading="lazy" onerror="this.onerror=null;this.src='https://testingcf.jsdelivr.net/gh/aDiesmos/whatver/wip.jpg';">
      <div class="game-info">
        <div class="game-title" data-game-id="${game.id}">${game.title}</div>
        <div class="game-actions">
          <button class="favorite-btn ${favorites.includes(game.id) ? 'favorited' : ''}" data-id="${game.id}">
            ${favorites.includes(game.id) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
      </div>
    `;
    gamesGrid.appendChild(gameCard);
  });
  
  updatePagination();
}


function updateGameCount() {
  const totalFilteredGames = filteredGames.length;
  const totalGames = games.length;
  const newGames = games.filter(game => game.isNew).length;
  
  let countText = `Total Games: ${totalGames} `;
  
  if (currentFilter === 'new') {
    countText = `New Games: ${newGames} `;
  } else if (searchQuery) {
    countText = `Found: ${totalFilteredGames} games `;
  }
  
  if (totalFilteredGames > GAMES_PER_PAGE) {
    const totalPages = getTotalPages();
    countText += ` (Page ${currentPage} of ${totalPages})`;
  }
  
  gameCount.textContent = countText;
}


function setupEventListeners() {
  
  filterButtons.forEach(button => {
    if (!button.dataset.filter) return;
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.dataset.filter;
      refreshGameViews();
    });
  });

  
  if (searchBar) searchBar.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    refreshGameViews();
  });

  
  if (mobileMenuBtn && navLinks) mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.favorite-btn');
    if (btn) {
      toggleFavorite(parseInt(btn.dataset.id));
      return;
    }

    const card = e.target.closest('.game-card');
    if (card) {
      const gameId = card.getAttribute('data-game-id');
      if (gameId) openGame(parseInt(gameId));
    }
  });

  document.addEventListener('pointerenter', (e) => {
    const card = e.target.closest('.game-card');
    if (!card) return;
    activeTiltCard = card;
  }, true);

  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.game-card');
    if (!card) {
      resetCardTilt(activeTiltCard);
      activeTiltCard = null;
      return;
    }

    if (activeTiltCard && activeTiltCard !== card) {
      resetCardTilt(activeTiltCard);
    }

    activeTiltCard = card;

    const visual = card.querySelector('.game-card-visual');
    const image = card.querySelector('.game-image');
    const rect = card.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const offsetY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((offsetX - centerX) / centerX) * 7;
    const rotateX = ((centerY - offsetY) / centerY) * 7;

    if (visual) {
      visual.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
      visual.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
    }

    if (image) {
      image.style.setProperty('--image-rotate-x', `${(rotateX * 0.55).toFixed(2)}deg`);
      image.style.setProperty('--image-rotate-y', `${(rotateY * 0.55).toFixed(2)}deg`);
    }
  });

  document.addEventListener('pointerleave', (e) => {
    const card = e.target.closest('.game-card');
    if (!card) return;

    resetCardTilt(card);
    if (activeTiltCard === card) {
      activeTiltCard = null;
    }
  }, true);

  
  if (closeOverlayBtn) closeOverlayBtn.addEventListener('click', closeGameOverlay);
  if (retryBtn) retryBtn.addEventListener('click', retryGameLoad);
  if (downloadGameBtn) downloadGameBtn.addEventListener('click', downloadGame);

  
  if (fullscreenBtn && iframeContainer) {
    fullscreenBtn.addEventListener('click', () => {
      toggleFullscreen(iframeContainer);
    });
  }

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gameOverlay) {
      if (gameOverlay.classList.contains('active')) {
        closeGameOverlay();
        e.preventDefault();
      }
    }
  });

 
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  
  if (gameIframe) {
    gameIframe.addEventListener('load', handleIframeLoad);
    gameIframe.addEventListener('error', handleIframeError);
  }

  if (cookieFileInput) {
    cookieFileInput.addEventListener('change', handleCookieUpload);
  }

  window.addEventListener('storage', (event) => {
    if (event.key === 'favorites') {
      refreshGameViews({ preservePage: true });
    }
  });

  window.addEventListener('focus', () => {
    refreshGameViews({ preservePage: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      refreshGameViews({ preservePage: true });
    }
  });

  return;
}
async function loadGameInIframe(gameUrl, gameTitle = 'this game') {
  if (!gameIframe) return false;

  try {
    currentGameUrl = gameUrl;
    currentGame = currentGame || null;
    hideError();
    showLoading();
    clearIframeLoadTimeout();
    gameIframe.src = 'about:blank';
    gameIframe.removeAttribute('srcdoc');
    iframeLoadTimeout = window.setTimeout(() => {
      hideLoading();
      showError(
        `Still trying to open ${gameTitle}.`,
        'The game took too long to load in the iframe. It may block embedding or just be slow.'
      );
      lastError = 'iframe_timeout';
    }, 12000);

    const response = await fetch(gameUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    if (!html.trim()) {
      throw new Error('The game response was empty.');
    }

    const blob = new Blob([html], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);

    if (previousBlobUrl) {
      URL.revokeObjectURL(previousBlobUrl);
    }

    previousBlobUrl = blobUrl;
    gameIframe.src = blobUrl;
    lastError = null;
    return true;
  } catch (error) {
    clearIframeLoadTimeout();
    hideLoading();
    gameIframe.src = 'about:blank';
    showError(`Could not open ${gameTitle}.`, error.message);
    lastError = 'fatal_error';
    return false;
  }
}

function handleIframeLoad() {
  clearIframeLoadTimeout();
  hideLoading();
  hideError();
}

function handleIframeError() {
  clearIframeLoadTimeout();
  hideLoading();
  showError('The game did not load.', currentGameUrl || 'Unknown game URL');
  lastError = 'iframe_error';
}

function clearIframeLoadTimeout() {
  if (iframeLoadTimeout) {
    clearTimeout(iframeLoadTimeout);
    iframeLoadTimeout = null;
  }
}

function toggleFullscreen(element) {
  if (!element) return;

  const isFullscreen = document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  if (!isFullscreen) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    return;
  }

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function handleFullscreenChange() {
  if (!fullscreenBtn) return;

  const isFullscreen = document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;

  fullscreenBtn.textContent = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
}

function resetCardTilt(card) {
  if (!card) return;

  const visual = card.querySelector('.game-card-visual');
  const image = card.querySelector('.game-image');
  if (visual) {
    visual.style.setProperty('--card-rotate-x', '0deg');
    visual.style.setProperty('--card-rotate-y', '0deg');
  }

  if (image) {
    image.style.setProperty('--image-rotate-x', '0deg');
    image.style.setProperty('--image-rotate-y', '0deg');
  }
}


function showLoading() {
  if (!gameLoading) return;
  gameLoading.classList.add('active');
  gameLoading.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 1rem;"></div>
      <div>Getting your game ready...</div>
      <small>This might take a moment! ⏳</small>
      <div style="margin-top: 1rem; font-size: 0.8rem; color: #ff66b2;">
        If it takes too long, try the Retry button!
      </div>
    </div>
  `;
}

function hideLoading() {
  if (!gameLoading) return;
  gameLoading.classList.remove('active');
}


function showError(userMessage, technicalReason = 'Unknown error') {
  if (!gameError) return;
  gameError.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:2rem;margin-bottom:0.5rem;"></div>

      <div style="margin-bottom:0.75rem;">
        ${userMessage}
      </div>

      <details style="
        margin-top:0.5rem;
        text-align:left;
        background:rgba(0,0,0,0.4);
        padding:0.75rem;
        border-radius:6px;
        font-size:0.85rem;
      ">
        <summary style="cursor:pointer;color:#ff9ad5;">
          Advanced details
        </summary>

        <div style="margin-top:0.5rem;line-height:1.4;">
          <strong>Possible reason:</strong><br>
          ${technicalReason}<br><br>

          <strong>Game URL:</strong><br>
          <code style="word-break:break-all;">
            ${currentGameUrl || 'Unknown'}
          </code><br><br>

          <strong>Load method:</strong><br>
          Blob / iframe hybrid loader
        </div>
      </details>
    </div>
  `;

  gameError.classList.add('active');
}


function hideError() {
  if (!gameError) return;
  gameError.classList.remove('active');
  if (errorTimeout) {
    clearTimeout(errorTimeout);
    errorTimeout = null;
  }
}


function retryGameLoad() {
  if (currentGame && currentGameUrl) {
    hideError();
    loadGameInIframe(currentGameUrl, currentGame.title || 'this game');
  }
}


function openGame(gameId) {
  const game = games.find(g => g.id === gameId);
  if (!game) return;
  logToClicky(game.title);
  
  if (overlayCloseTimeout) {
    clearTimeout(overlayCloseTimeout);
    overlayCloseTimeout = null;
  }

  currentGame = game;
  overlayGameTitle.textContent = `Playing: ${game.title} `;
  
  
  gameOverlay.classList.remove('closing');
  gameOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  
  const gameUrl = game.translatedUrl || game.url;
  
  loadGameInIframe(gameUrl, game.title);
}


function closeGameOverlay() {
  if (!gameOverlay || !gameOverlay.classList.contains('active')) return;

  gameOverlay.classList.add('closing');
  gameOverlay.classList.remove('active');

  clearIframeLoadTimeout();

  if (overlayCloseTimeout) {
    clearTimeout(overlayCloseTimeout);
  }

  overlayCloseTimeout = window.setTimeout(() => {
    hideLoading();
    hideError();
    gameIframe.src = 'about:blank';

    if (previousBlobUrl) {
      URL.revokeObjectURL(previousBlobUrl);
      previousBlobUrl = null;
    }

    currentGame = null;
    currentGameUrl = '';
    lastError = null;
    document.body.style.overflow = '';
    gameOverlay.classList.remove('closing');
    overlayCloseTimeout = null;
  }, 220);

  if (document.fullscreenElement || 
      document.webkitFullscreenElement || 
      document.mozFullScreenElement || 
      document.msFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}


function downloadGame() {
  if (!currentGame) {
    alert('No game loaded to download! ');
    return;
  }
  
  try {
    
    const gameUrl = currentGame.translatedUrl || currentGame.url;
    
    
    fetch(gameUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then(gameHtml => {
        
        if (!gameHtml.includes('<html') && !gameHtml.includes('<!DOCTYPE')) {
          throw new Error('Not valid HTML');
        }
        
        
        let modifiedHtml = gameHtml;
        
       
        const bodyStart = modifiedHtml.indexOf('<body');
        if (bodyStart !== -1) {
          const bodyEnd = modifiedHtml.indexOf('>', bodyStart) + 1;
          const watermark = `
            <div style="
              position: fixed;
              top: 10px;
              left: 10px;
              background: rgba(0,0,0,0.7);
              color: white;
              padding: 8px 12px;
              border-radius: 5px;
              font-family: Arial, sans-serif;
              font-size: 12px;
              z-index: 9999;
              border: 1px solid rgba(255,102,178,0.5);
            ">
              ${currentGame.title} - Downloaded from Diesmos 
            </div>
          `;
          modifiedHtml = modifiedHtml.slice(0, bodyEnd) + watermark + modifiedHtml.slice(bodyEnd);
        } else {
         
          modifiedHtml += `
            <div style="
              position: fixed;
              top: 10px;
              left: 10px;
              background: rgba(0,0,0,0.7);
              color: white;
              padding: 8px 12px;
              border-radius: 5px;
              font-family: Arial, sans-serif;
              font-size: 12px;
              z-index: 9999;
              border: 1px solid rgba(255,102,178,0.5);
            ">
              ${currentGame.title} - Downloaded from Diesmos 
            </div>
          `;
        }
        
        
        const blob = new Blob([modifiedHtml], { type: 'text/html' });
        
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        
        const cleanTitle = currentGame.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `diesmos_${cleanTitle}.html`;
        
        a.href = url;
        a.download = filename;
        
        
        document.body.appendChild(a);
        a.click();
        
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
        
      })
      .catch(error => {
        
        const fallbackHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${currentGame.title}</title>
              <style>
                html, body {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  background: #000;
                }
                iframe {
                  width: 100%;
                  height: 100%;
                  border: none;
                }
                .game-info {
                  position: fixed;
                  top: 10px;
                  left: 10px;
                  background: rgba(0,0,0,0.7);
                  color: white;
                  padding: 10px;
                  border-radius: 5px;
                  font-family: Arial, sans-serif;
                  font-size: 12px;
                  z-index: 1000;
                  border: 1px solid rgba(255,102,178,0.5);
                }
              </style>
            </head>
            <body>
              <div class="game-info">
                ${currentGame.title} - Downloaded from Diesmos 
              </div>
              <iframe src="${gameUrl}" allowfullscreen></iframe>
            </body>
          </html>
        `;
        
        const blob = new Blob([fallbackHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        const cleanTitle = currentGame.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `diesmos_${cleanTitle}.html`;
        
        a.href = url;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      });
    
  } catch (error) {
    alert('Oops! Could not download the game \nTry loading it first, then download!');
  }
}


function toggleFavorite(gameId) {
  const index = favorites.indexOf(gameId);
  const game = games.find(g => g.id === gameId);

  if (index === -1) {
    favorites.push(gameId);
    if (game) logToClicky(`${game.title} favorite_add`);
  } else {
    favorites.splice(index, 1);
    if (game) logToClicky(`${game.title} favorite_remove`);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  refreshGameViews({ preservePage: true });
}


function renderFavorites() {
  const container = document.getElementById('favoritesContainer');
  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = `
      <div class="empty-favorites">
        <p>You haven't added any favorites yet.</p>
        <p>Click the ❤️ icon on games to add them here. </p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  const favoriteGames = games.filter(game => favorites.includes(game.id));

  favoriteGames.forEach(game => {
    const gameCard = document.createElement('div');
    gameCard.className = `game-card ${game.isNew ? 'new' : ''}`;
    gameCard.setAttribute('data-game-id', game.id);

    gameCard.innerHTML = `
      <div class="game-card-visual">
        <img src="${game.translatedImage || game.image}" class="game-image">
        <div class="game-info">
          <div class="game-title">${game.title}</div>
          <button class="favorite-btn favorited" data-id="${game.id}">❤️</button>
        </div>
      </div>
    `;

    container.appendChild(gameCard);
  });
}


function openSuggestions() {
  window.open(
    "https://docs.google.com/forms/d/e/1FAIpQLSfqTJRoaUQJ3YgpZALPIE85umsW12IBXtv6BaI9Y0fdB_XqzQ/viewform?fbzx=492301836448601508&pli=1",
    "_blank"
  );
}

function setupMusicPlayer() {
  if (!musicAudio || !visualizerCanvas) return;

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    visualizerCanvas.width = Math.floor(window.innerWidth * ratio);
    visualizerCanvas.height = Math.floor(window.innerHeight * ratio);
    const ctx = visualizerCanvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  if (musicUploadBtn) {
    musicUploadBtn.addEventListener('click', () => {
      if (musicFilePicker) {
        musicFilePicker.value = '';
        musicFilePicker.click();
      }
    });
  }

  if (musicFilePicker) {
    musicFilePicker.addEventListener('change', handleMusicFileSelect);
  }

  if (musicPlayPauseBtn) {
    musicPlayPauseBtn.addEventListener('click', async () => {
      if (!musicAudio.src) {
        if (musicFilePicker) musicFilePicker.click();
        return;
      }

      if (musicAudio.paused) {
        await startMusicPlayback();
      } else {
        musicAudio.pause();
      }
    });
  }

  if (musicLoopBtn) {
    musicLoopBtn.addEventListener('click', () => {
      musicAudio.loop = !musicAudio.loop;
      updateMusicUi();
    });
  }

  musicAudio.addEventListener('play', async () => {
    await ensureVisualizerGraph();
    updateMusicUi();
    startVisualizer();
  });

  musicAudio.addEventListener('pause', () => {
    updateMusicUi();
  });

  musicAudio.addEventListener('ended', () => {
    updateMusicUi();
  });

  musicAudio.addEventListener('loadedmetadata', () => {
    updateMusicUi();
  });

  updateMusicUi();
  drawVisualizerFrame();
}

async function handleMusicFileSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file || !musicAudio) return;

  if (currentMusicUrl) {
    URL.revokeObjectURL(currentMusicUrl);
  }

  currentMusicUrl = URL.createObjectURL(file);
  musicAudio.src = currentMusicUrl;
  currentMusicMeta = await extractAudioMetadata(file);
  applyMusicMetadata(currentMusicMeta);
  updateMusicUi();
  await startMusicPlayback();
}

async function startMusicPlayback() {
  if (!musicAudio) return;

  await ensureVisualizerGraph();
  await musicAudio.play();
  updateMusicUi();
}

async function ensureVisualizerGraph() {
  if (!musicAudio) return;

  if (!musicAudioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      musicStatus.textContent = 'Visualizer not supported in this browser.';
      return;
    }

    musicAudioContext = new AudioContextClass();
    musicAnalyser = musicAudioContext.createAnalyser();
    musicAnalyser.fftSize = 128;
    musicAnalyser.smoothingTimeConstant = 0.82;
    musicSourceNode = musicAudioContext.createMediaElementSource(musicAudio);
    musicSourceNode.connect(musicAnalyser);
    musicAnalyser.connect(musicAudioContext.destination);
  }

  if (musicAudioContext.state === 'suspended') {
    await musicAudioContext.resume();
  }
}

function updateMusicUi() {
  if (!musicAudio || !musicPlayPauseBtn || !musicStatus) return;

  musicPlayPauseBtn.textContent = musicAudio.paused ? 'Play' : 'Pause';
  if (musicLoopBtn) {
    musicLoopBtn.textContent = musicAudio.loop ? 'Loop On' : 'Loop Off';
    musicLoopBtn.classList.toggle('active', musicAudio.loop);
  }

  if (!currentMusicMeta) {
    applyMusicMetadata(null);
  } else {
    applyMusicMetadata(currentMusicMeta);
  }

  if (!musicAudio.src) {
    musicStatus.textContent = 'Choose a song to start the visualizer.';
  } else if (musicAudio.paused) {
    musicStatus.textContent = 'Paused.';
  } else {
    musicStatus.textContent = 'Now playing.';
  }
}

function startVisualizer() {
  if (visualizerFrame) return;
  visualizerFrame = requestAnimationFrame(drawVisualizerFrame);
}

function drawVisualizerFrame() {
  const ctx = visualizerCanvas && visualizerCanvas.getContext('2d');
  if (!ctx || !visualizerCanvas) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(111, 188, 111, 0.10)');
  gradient.addColorStop(1, 'rgba(79, 166, 79, 0.02)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (musicAnalyser) {
    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    musicAnalyser.getByteFrequencyData(data);

    const barWidth = Math.max(10, width / data.length);
    data.forEach((value, index) => {
      const barHeight = (value / 255) * height * 0.42;
      const x = index * barWidth;
      const y = height - barHeight;
      const hue = 110 + index * 0.9;
      ctx.fillStyle = `hsla(${hue}, 70%, 55%, 0.18)`;
      ctx.fillRect(x + 1, y, barWidth - 6, barHeight);
    });
  }

  visualizerFrame = requestAnimationFrame(drawVisualizerFrame);
}

function applyMusicMetadata(meta) {
  const fallbackMeta = meta || getEmptyMusicMetadata();
  const durationText = Number.isFinite(musicAudio.duration) ? formatDuration(musicAudio.duration) : fallbackMeta.durationText;
  const detailsParts = [fallbackMeta.fileType, fallbackMeta.fileSize, durationText].filter(Boolean);

  if (musicTrackLabel) {
    musicTrackLabel.textContent = fallbackMeta.title || 'No track loaded';
  }

  if (musicArtistLabel) {
    musicArtistLabel.textContent = fallbackMeta.artist || 'Unknown';
  }

  if (musicAlbumLabel) {
    musicAlbumLabel.textContent = fallbackMeta.album || 'Unknown';
  }

  if (musicDetailsLabel) {
    musicDetailsLabel.textContent = detailsParts.length ? detailsParts.join(' - ') : 'No file loaded';
  }
}

function getEmptyMusicMetadata() {
  return {
    title: '',
    artist: '',
    album: '',
    fileType: '',
    fileSize: '',
    durationText: ''
  };
}

async function extractAudioMetadata(file) {
  const fallback = buildFallbackMusicMetadata(file);

  try {
    if (file.type === 'audio/mpeg' || /\.mp3$/i.test(file.name)) {
      const id3Meta = await parseId3Metadata(file);
      return { ...fallback, ...id3Meta };
    }
  } catch (error) {
    console.warn('Could not read audio metadata:', error);
  }

  return fallback;
}

function buildFallbackMusicMetadata(file) {
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const parts = baseName.split(/\s+-\s+/);
  const artist = parts.length > 1 ? parts.shift().trim() : '';
  const title = parts.length > 0 ? parts.join(' - ').trim() : baseName;

  return {
    title: title || 'Unknown Track',
    artist,
    album: '',
    fileType: (file.type || 'audio file').replace(/^audio\//i, '').toUpperCase(),
    fileSize: formatFileSize(file.size),
    durationText: ''
  };
}

async function parseId3Metadata(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (bytes.length < 10 || readAscii(bytes, 0, 3) !== 'ID3') {
    return {};
  }

  const versionMajor = bytes[3];
  const tagSize = readSyncSafeInteger(bytes, 6);
  const metadata = {};
  let offset = 10;
  const tagEnd = Math.min(bytes.length, 10 + tagSize);

  while (offset + 10 <= tagEnd) {
    const frameId = readAscii(bytes, offset, 4);
    if (!frameId.trim() || frameId === '\u0000\u0000\u0000\u0000') {
      break;
    }

    const frameSize = versionMajor === 4
      ? readSyncSafeInteger(bytes, offset + 4)
      : readBigEndianInteger(bytes, offset + 4, 4);

    if (!frameSize || offset + 10 + frameSize > tagEnd) {
      break;
    }

    const frameData = bytes.slice(offset + 10, offset + 10 + frameSize);
    const decoded = decodeId3TextFrame(frameData);

    if (decoded) {
      if (frameId === 'TIT2') metadata.title = decoded;
      if (frameId === 'TPE1') metadata.artist = decoded;
      if (frameId === 'TALB') metadata.album = decoded;
    }

    offset += 10 + frameSize;
  }

  return metadata;
}

function decodeId3TextFrame(frameData) {
  if (!frameData || frameData.length < 2) return '';

  const encoding = frameData[0];
  const content = frameData.slice(1);

  try {
    if (encoding === 0) {
      return new TextDecoder('iso-8859-1').decode(content).replace(/\u0000/g, '').trim();
    }

    if (encoding === 1 || encoding === 2) {
      const textBytes = content.length % 2 === 0 ? content : content.slice(0, -1);
      return new TextDecoder('utf-16').decode(textBytes).replace(/\u0000/g, '').trim();
    }

    if (encoding === 3) {
      return new TextDecoder('utf-8').decode(content).replace(/\u0000/g, '').trim();
    }
  } catch (error) {
    return '';
  }

  return '';
}

function readAscii(bytes, start, length) {
  let value = '';
  for (let i = 0; i < length; i++) {
    value += String.fromCharCode(bytes[start + i] || 0);
  }
  return value;
}

function readSyncSafeInteger(bytes, start) {
  return ((bytes[start] & 0x7f) << 21) |
         ((bytes[start + 1] & 0x7f) << 14) |
         ((bytes[start + 2] & 0x7f) << 7) |
         (bytes[start + 3] & 0x7f);
}

function readBigEndianInteger(bytes, start, length) {
  let value = 0;
  for (let i = 0; i < length; i++) {
    value = (value << 8) | (bytes[start + i] || 0);
  }
  return value;
}

function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  const decimals = unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '';
  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function exportCookies() {
  const payload = {
    exportedAt: new Date().toISOString(),
    cookies: document.cookie,
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]')
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'diesmos-cookies.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importCookies() {
  if (!cookieFileInput) return;
  cookieFileInput.value = '';
  cookieFileInput.click();
}

function handleCookieUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);

      if (typeof payload.cookies === 'string' && payload.cookies.trim()) {
        payload.cookies.split(';').forEach(cookiePart => {
          const cookie = cookiePart.trim();
          if (cookie) {
            document.cookie = `${cookie}; path=/`;
          }
        });
      }

      if (Array.isArray(payload.favorites)) {
        localStorage.setItem('favorites', JSON.stringify(payload.favorites));
        favorites = payload.favorites;
        refreshGameViews({ preservePage: true });
      }

      alert('Cookies imported.');
    } catch (error) {
      alert(`Could not import cookies: ${error.message}`);
    }
  };

  reader.readAsText(file);
}


function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Have an awesome day! ';
  if (hour < 12) greeting = 'Good morning! ';
  else if (hour < 18) greeting = 'Good afternoon! ';
  else greeting = 'Good evening! ';
  const greetingElement = document.getElementById('greeting');
  if (greetingElement) {
    greetingElement.textContent = greeting;
  }
}


function createHearts() {
  const heartsContainer = document.getElementById('hearts');
  if (!heartsContainer) return;

  const hearts = ['', '', '', '', '', '', '', ''];
  
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDelay = `${Math.random() * 20}s`;
    heart.style.animationDuration = `${15 + Math.random() * 10}s`;
    heart.style.fontSize = `${1 + Math.random() * 2}rem`;
    heartsContainer.appendChild(heart);
  }
}
