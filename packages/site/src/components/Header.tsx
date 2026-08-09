import type { Basics } from "../types";

export interface HeaderProps {
  basics?: Basics;
  logoText?: string;
}

export function Header({ basics, logoText }: HeaderProps) {
  if (!basics) return null;
  const location = [basics.location?.city, basics.location?.countryCode].filter(Boolean).join(", ");

  return (
    <header className="section header">
      {logoText && <div className="logo">{logoText}</div>}
      <h1 className="name">{basics.name}</h1>
      {basics.label && <p className="label">{basics.label}</p>}
      <div className="contact-row">
        {location && <span>{location}</span>}
        {basics.email && <span>{basics.email}</span>}
        {basics.phone && <span>{basics.phone}</span>}
        {(basics.profiles ?? []).map((profile) => (
          <a key={profile.network} href={profile.url} target="_blank" rel="noreferrer">
            {profile.network}
          </a>
        ))}
      </div>
    </header>
  );
}
