import supabase from "../db/supabaseClient.js";

// ---------------------------
// LOGIN USER
// ---------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    // Supabase search filter
    const { data: users, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email);

    if (error) throw error;

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
    res.status(500).json({ error: "Supabase login error" });
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
    const { data: existing, error: findError } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email);

    if (findError) throw findError;

    if (existing.length > 0)
      return res.status(409).json({ error: "Email already registered" });

    const empid = `E${String(Date.now()).slice(-6)}`;

    // Supabase insert
    const { error: insertError } = await supabase
      .from('employees')
      .insert([
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
      ]);

    if (insertError) throw insertError;

    res.json({ success: true, message: "Account created successfully" });
  } catch (err) {
    console.error("Signup error →", err);
    res.status(500).json({ error: "Supabase signup error" });
  }
};
