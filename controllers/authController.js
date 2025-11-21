import sheetDB from "../db/connection.js";

// ---------------------------
// LOGIN USER
// ---------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    // SheetDB search filter
    const { data: users } = await sheetDB.get("/search", {
      params: { email }
    });

    if (!users || users.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = users[0];

    if (user.password !== password)
      return res.status(401).json({ error: "Invalid credentials" });

    const safeUser = {
      empid: user.empid,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({ success: true, user: safeUser });

  } catch (err) {
    console.error("Login error →", err);
    res.status(500).json({ error: "SheetDB login error" });
  }
};

// ---------------------------
// SIGNUP USER
// ---------------------------
export const signupUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ error: "All fields required" });

  try {
    const { data: existing } = await sheetDB.get("/search", {
      params: { email }
    });

    if (existing.length > 0)
      return res.status(409).json({ error: "Email already registered" });

    const empid = `E${String(Date.now()).slice(-6)}`;

    // SheetDB MUST receive "data" array
    await sheetDB.post("/", {
      data: [
        {
          empid,
          name,
          email,
          password,
          availability: "Occupied",
          hours_available: "",
          from_date: "",
          to_date: "",
          current_skills: "[]",
          interests: "[]",
          previous_projects: "[]",
          role: "Employee",
        }
      ]
    });

    res.json({ success: true, message: "Account created successfully" });
  } catch (err) {
    console.error("Signup error →", err);
    res.status(500).json({ error: "SheetDB signup error" });
  }
};
