import SettingsDialog from "../settings-dialog/SettingsDialog";
import "./header.scss";

export default function Header() {
  return (
    <header className="app-header">
      <div className="branding">
        <span className="material-symbols-outlined logo">psychology_alt</span>
        <h1>LOMIA</h1>
        <span className="subtitle">live ai mock interviews</span>
      </div>
      <div className="header-actions">
        <SettingsDialog />
      </div>
    </header>
  );
} 