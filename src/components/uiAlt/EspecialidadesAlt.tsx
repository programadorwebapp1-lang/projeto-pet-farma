import React from "react";

export default function EspecialidadesAlt() {
  return (
    <section className="especialidades">
      <h2>ESPECIALIDADES VETERINÁRIAS</h2>
      <div className="especialidades-grid">
        <div className="especialidade"><img src="https://img.icons8.com/ios/50/cat.png" /><span>Medicina <b>felina</b></span></div>
        <div className="especialidade"><img src="https://img.icons8.com/ios/50/surgery.png" /><span>Cirurgia <b>veterinária</b></span></div>
        <div className="especialidade"><img src="https://img.icons8.com/ios/50/tooth.png" /><span>Odontologia <b>veterinária</b></span></div>
        <div className="especialidade"><img src="https://img.icons8.com/ios/50/doctor-male.png" /><span>Dermatologia <b>veterinária</b></span></div>
        <div className="especialidade"><img src="https://img.icons8.com/ios/50/visible.png" /><span>Oftalmologia <b>veterinária</b></span></div>
        <div className="especialidade"><img src="https://img.icons8.com/ios/50/bone.png" /><span>Ortopedia <b>veterinária</b></span></div>
        <div className="especialidade"><img src="https://img.icons8.com/ios/50/acupuncture.png" /><span>Acupuntura <b>veterinária</b></span></div>
        <div className="especialidade"><img src="https://img.icons8.com/ios/50/physiotherapy.png" /><span>Fisioterapia <b>veterinária</b></span></div>
      </div>
      <button className="todas">TODAS AS ESPECIALIDADES</button>
    </section>
  );
}
