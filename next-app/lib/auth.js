import crypto from "crypto";
import { query } from "@/lib/db";

const HASH_ALGORITHM = "scrypt";
const KEY_LENGTH = 64;
const PASSWORD_MIN_LENGTH = 8;

function ensurePassword(password) {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`);
  }
}

export function hashPassword(password) {
  ensurePassword(password);
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${HASH_ALGORITHM}$${salt}$${derivedKey}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  const [algorithm, salt, digest] = storedHash.split("$");
  if (!algorithm || !salt || !digest) return false;
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(derivedKey, "hex"));
}

export async function getUserByEmail(email) {
  const rows = await query(
    "SELECT id, name, email, password_hash, role, status, created_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] ?? null;
}

export async function getUserById(id) {
  const rows = await query(
    `SELECT id, name, email, role, status, phone, address, city, country, created_at, updated_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createUser({ name, email, password, role = "customer" }) {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error("El correo ya est� registrado.");
  }

  const passwordHash = hashPassword(password);
  const now = new Date();
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'active', ?, ?)` ,
    [name, email, passwordHash, role, now, now]
  );

  return { id: result.insertId, name, email, role, status: "active" };
}

export async function updateUserProfile(userId, data) {
  const fields = ["name", "email", "phone", "address", "city", "country"];
  const updates = [];
  const values = [];

  fields.forEach((field) => {
    if (field in data) {
      updates.push(`${field} = ?`);
      values.push(data[field]);
    }
  });

  if (updates.length === 0) {
    return { updated: false };
  }

  values.push(new Date(), userId);
  await query(
    `UPDATE users SET ${updates.join(", ")}, updated_at = ? WHERE id = ?`,
    values
  );
  return { updated: true };
}

export async function updateUserPassword(userId, currentPassword, nextPassword) {
  ensurePassword(nextPassword);
  const user = await query(
    "SELECT password_hash FROM users WHERE id = ? LIMIT 1",
    [userId]
  ).then((rows) => rows[0]);

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const isValid = verifyPassword(currentPassword, user.password_hash);
  if (!isValid) {
    throw new Error("La contrase�a actual no es correcta.");
  }

  const newHash = hashPassword(nextPassword);
  await query(
    "UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?",
    [newHash, new Date(), userId]
  );

  return { updated: true };
}

export async function updateUserSettings(userId, settings) {
  await query(
    `INSERT INTO user_settings (user_id, preferences, updated_at)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE preferences = VALUES(preferences), updated_at = VALUES(updated_at)` ,
    [userId, JSON.stringify(settings), new Date()]
  );
  return { saved: true };
}

export async function createPasswordResetRequest(email) {
  const user = await getUserByEmail(email);
  if (!user) {
    return { token: null };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

  await query(
    `INSERT INTO password_resets (user_id, token, expires_at)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at)` ,
    [user.id, token, expiresAt]
  );

  return { token, user };
}

