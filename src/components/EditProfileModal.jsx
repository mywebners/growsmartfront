import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Modal: update name, profile image, optional new password → PUT /auth/profile
 */
function EditProfileModal({ open, onClose }) {
  const { profile, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(profile?.name || "");
    setImage(profile?.image || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  }, [open, profile]);

  if (!open) return null;

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 400 * 1024) {
      setError("Image must be under 400KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result || ""));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (newPassword) {
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match");
        return;
      }
      if (!currentPassword) {
        setError("Enter current password to set a new one");
        return;
      }
    }

    const body = {
      name: name.trim(),
      image: image || "",
    };
    if (newPassword) {
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    setSaving(true);
    try {
      await updateProfile(body);
      onClose();
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="gs-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
      onClick={onClose}
    >
      <div
        className="gs-modal-card glass-card"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="gs-modal-head">
          <h2>Edit profile</h2>
          <button type="button" className="gs-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="gs-edit-profile" onSubmit={handleSave}>
          <div className="gs-edit-avatar-row">
            <div className="gs-edit-avatar">
              {image ? (
                <img src={image} alt="" />
              ) : (
                <span>{(name || "?").charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="gs-edit-avatar-actions">
              <label className="gs-file-btn">
                Change photo
                <input type="file" accept="image/*" hidden onChange={onPickImage} />
              </label>
              {image ? (
                <button type="button" className="gs-link-btn" onClick={() => setImage("")}>
                  Remove photo
                </button>
              ) : null}
            </div>
          </div>

          <label className="gs-field">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
            />
          </label>

          <label className="gs-field">
            <span>Email</span>
            <input type="email" value={profile?.email || ""} disabled />
          </label>

          <p className="gs-field-hint">Optional — change password</p>

          <label className="gs-field">
            <span>Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <label className="gs-field">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          <label className="gs-field">
            <span>Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>

          {error ? <p className="gs-form-error">{error}</p> : null}

          <div className="gs-modal-actions">
            <button type="button" className="gs-btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="gs-btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
