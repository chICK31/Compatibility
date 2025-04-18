const temples = {
    "Heart": ["ENTP", "ESFP", "ISFJ", "INTJ"],
    "Mind": ["ENFJ", "ISTP", "INFP", "ESTJ"],
    "Soul": ["INFJ", "ENFP", "ISTJ", "ESTP"],
    "Body": ["INTP", "ISFP", "ENTJ", "ESFJ"]
  };
  
  const quadras = {
    "Crusaders": ["ISFJ", "ESFJ", "INTP", "ENTP"],
    "Templars": ["ESTP", "INFJ", "ISTP", "ENFJ"],
    "Wayfarers": ["INTJ", "ENTJ", "ESFP", "ISFP"],
    "Philosophers": ["INFP", "ENFP", "ISTJ", "ESTJ"]
  };
  
  const relationshipRanks = [
    "YYYX", "YXXY", "XXXY", "XYYX", "YXYY", "XXYY", "YYXX", "XYXX",
    "YYXY", "XYXY", "YXYX", "XXYX", "XXXX", "YXXX", "XYYY", "YYYY"
  ];
  
  function getTemple(type) {
    return Object.entries(temples).find(([, list]) => list.includes(type))?.[0] || "";
  }
  
  function getQuadra(type) {
    return Object.entries(quadras).find(([, list]) => list.includes(type))?.[0] || "";
  }
  
  function getOctagramType(octa) {
    return octa.startsWith("UD") ? "UD" : "SD";
  }
  
  function getRelationshipCode(typeA, typeB) {
    return typeA.split('').map((char, i) => char === typeB[i] ? "X" : "Y").join('');
  }
  
  function getRelationshipScore(code) {
    const rank = relationshipRanks.indexOf(code);
    return rank >= 0 ? ((relationshipRanks.length - rank) / relationshipRanks.length) * 100 : 0;
  }
  
  function getTempleBonus(tA, tB, relCode) {
    if (tA === tB && relCode !== "XXXX" && relCode !== "YYYY") return 10;
    const compatible = {
      "Heart": "Body", "Body": "Heart",
      "Soul": "Mind", "Mind": "Soul"
    };
    if (compatible[tA] === tB) return 8;
    if ((tA === "Heart" && tB === "Soul") || (tA === "Soul" && tB === "Heart")) return 4;
    if ((tA === "Mind" && tB === "Body") || (tA === "Body" && tB === "Mind")) return 2;
    return 0;
  }
  
  function getQuadraBonus(qA, qB) {
    const compatible = {
      "Crusaders": "Wayfarers", "Wayfarers": "Crusaders",
      "Philosophers": "Templars", "Templars": "Philosophers"
    };
    return compatible[qA] === qB ? 6 : (qA === qB ? 3 : 0);
  }
  
  function getOctagramBonus(oA, oB) {
    return oA === oB ? 4 : 0;
  }
  
  function checkCompatibility() {
    const mbtiA = document.getElementById('mbtiA').value;
    const octagramA = document.getElementById('octagramA').value;
    const genderA = document.getElementById('genderA').value;
  
    const mbtiB = document.getElementById('mbtiB').value;
    const octagramB = document.getElementById('octagramB').value;
    const genderB = document.getElementById('genderB').value;
  
    if (!mbtiA || !mbtiB || !octagramA || !octagramB || !genderA || !genderB) {
      document.getElementById('result').textContent = "Please fill out all selections.";
      return;
    }
  
    const relCode = getRelationshipCode(mbtiA, mbtiB);
    let score = getRelationshipScore(relCode);
  
    const templeBonus = getTempleBonus(getTemple(mbtiA), getTemple(mbtiB), relCode);
    const quadraBonus = getQuadraBonus(getQuadra(mbtiA), getQuadra(mbtiB));
    const octaTypeA = getOctagramType(octagramA);
    const octaTypeB = getOctagramType(octagramB);
    let octaBonus = getOctagramBonus(octaTypeA, octaTypeB);
  
    // Octagram mismatch penalty
    if (octaTypeA !== octaTypeB) {
      octaBonus -= 10; // Includes the -2 and Apex adjustment logic
    }
  
    // UF penalty
    let penalty = 0;
    if (octagramA.endsWith("UF")) penalty += 5;
    if (octagramB.endsWith("UF")) penalty += 5;
  
    score += templeBonus + quadraBonus + octaBonus;
    score -= penalty;
    score = Math.max(0, Math.min(score, 100));
  
    // Comradery
    let camaraderie = 100 - score;
    if (genderA === "Female" || genderB === "Female") {
      camaraderie *= 0.85;
    }
  
    // Romantic compatibility (with hard mismatch penalty)
    let romanticCompatibility = score;
    if (octaTypeA !== octaTypeB) {
      romanticCompatibility -= 50;
    }
    romanticCompatibility = Math.max(0, Math.min(romanticCompatibility, 100));
  
    // Final output
    document.getElementById('result').textContent =
      `🔗 Compatibility: ${score.toFixed(1)}% | 💘 Romantic: ${romanticCompatibility.toFixed(1)}% | 🧠 Comradery: ${camaraderie.toFixed(1)}%`;
  }
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  
    // Optional: Change icon based on theme
    const toggle = document.getElementById('darkModeToggle');
    toggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  });
  