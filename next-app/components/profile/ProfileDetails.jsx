"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthContext";

const INITIAL_PROFILE = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  photoUrl: ""
};

export default function ProfileDetails() {
  const { user, login } = useAuth();
  const userId = user?.id;

  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [profileFeedback, setProfileFeedback] = useState("");
  const [isProfileSaving, setProfileSaving] = useState(false);

  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoFeedback, setPhotoFeedback] = useState("");
  const [isPhotoSaving, setPhotoSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      if (!userId) return;
      try {
        const response = await fetch(`/api/user/profile?userId=${userId}`);
        if (!response.ok) {
          throw new Error("No se pudo obtener la informacion del perfil.");
        }
        const data = await response.json();
        if (!active) return;
        const sourceUser = data.user ?? user;
        const mapped = mapUserToProfile(sourceUser);
        setProfile(mapped);
        setPhotoPreview(mapped.photoUrl ?? "");
      } catch (error) {
        console.error("[ProfileDetails load]", error);
      }
    }
    if (userId) {
      loadProfile();
    }
    return () => {
      active = false;
    };
  }, [userId, login]);

  useEffect(() => {
    if (!photoPreview) return undefined;
    return () => {
      if (photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const initials = useMemo(() => getInitials(profile.name || user?.name), [profile.name, user?.name]);

  const handleProfileField = (field) => (event) => {
    const value = event.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFeedback("");
  };

  const handlePhotoUpload = async () => {
    if (!userId || !photoFile) {
      setPhotoFeedback("Selecciona una imagen antes de guardar.");
      return;
    }
    setPhotoSaving(true);
    setPhotoFeedback("");
    try {
      const formData = new FormData();
      formData.append("userId", String(userId));
      formData.append("photo", photoFile);
      const response = await fetch("/api/user/photo", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo actualizar la foto.");
      }
      setPhotoFeedback("Foto actualizada correctamente.");
      setProfile((prev) => ({ ...prev, photoUrl: data.photoUrl }));
      setPhotoPreview(data.photoUrl);
      if (data.user) {
        login(data.user);
      }
      setPhotoFile(null);
    } catch (error) {
      setPhotoFeedback(error.message);
    } finally {
      setPhotoSaving(false);
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!userId) return;
    setProfileSaving(true);
    setProfileFeedback("");
    try {
      const payload = {
        userId,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        photo_url: profile.photoUrl
      };
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "No se pudo actualizar el perfil.");
      }
      setProfileFeedback("Datos guardados correctamente.");
      if (data.user) {
        const mapped = mapUserToProfile(data.user);
        setProfile(mapped);
        setPhotoPreview(mapped.photoUrl ?? "");
        login(data.user);
      }
    } catch (error) {
      setProfileFeedback(error.message);
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <article className="panel-card">
      <h2>Perfil y contacto</h2>
      <div className="profile-avatar">
        {photoPreview ? (
          <img src={photoPreview} alt={profile.name || "Usuario"} className="profile-photo" />
        ) : (
          <div className="profile-initials">{initials}</div>
        )}
        <div className="profile-avatar-actions">
          <label className="upload-button">
            <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
            Cambiar foto
          </label>
          <button
            type="button"
            className="panel-button secondary"
            onClick={handlePhotoUpload}
            disabled={isPhotoSaving || !photoFile}
          >
            {isPhotoSaving ? "Guardando..." : "Guardar foto"}
          </button>
          {photoFeedback && <p className="panel-feedback">{photoFeedback}</p>}
          <p className="panel-hint">Formatos permitidos: JPG, PNG. Tamano maximo recomendado 1 MB.</p>
        </div>
      </div>

      <form className="panel-form" onSubmit={handleProfileSubmit}>
        <label className="panel-label" htmlFor="name">
          Nombre completo
        </label>
        <input
          id="name"
          className="panel-input"
          type="text"
          placeholder="Nombre y apellido"
          value={profile.name}
          onChange={handleProfileField("name")}
          required
        />

        <label className="panel-label" htmlFor="email">
          Correo electronico
        </label>
        <input
          id="email"
          className="panel-input"
          type="email"
          placeholder="tucorreo@dominio.com"
          value={profile.email}
          onChange={handleProfileField("email")}
          required
        />

        <label className="panel-label" htmlFor="phone">
          Telefono de contacto
        </label>
        <input
          id="phone"
          className="panel-input"
          type="tel"
          placeholder="000 000 0000"
          value={profile.phone}
          onChange={handleProfileField("phone")}
        />

        <label className="panel-label" htmlFor="address">
          Direccion
        </label>
        <input
          id="address"
          className="panel-input"
          type="text"
          placeholder="Calle, numero y referencia"
          value={profile.address}
          onChange={handleProfileField("address")}
        />

        <div className="form-inline">
          <div>
            <label className="panel-label" htmlFor="city">
              Ciudad
            </label>
            <input
              id="city"
              className="panel-input"
              type="text"
              placeholder="Ciudad"
              value={profile.city}
              onChange={handleProfileField("city")}
            />
          </div>
          <div>
            <label className="panel-label" htmlFor="country">
              Pais
            </label>
            <input
              id="country"
              className="panel-input"
              type="text"
              placeholder="Pais"
              value={profile.country}
              onChange={handleProfileField("country")}
            />
          </div>
        </div>

        <button className="panel-button" type="submit" disabled={isProfileSaving}>
          {isProfileSaving ? "Guardando..." : "Guardar cambios"}
        </button>
        {profileFeedback && <p className="panel-feedback">{profileFeedback}</p>}
      </form>
    </article>
  );
}

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  const [first, second] = parts;
  const initials = [first?.[0], second?.[0]].filter(Boolean).join("").toUpperCase();
  return initials || "U";
}

function mapUserToProfile(user) {
  if (!user) return { ...INITIAL_PROFILE };
  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    country: user.country || "",
    photoUrl: user.photoUrl || user.photo_url || ""
  };
}






