import { useState } from "react";

import {
  User,
  Shield,
  Building2,
  Mail,
  Phone,
  MapPin,
  Pencil,
  KeyRound,
  Save,
  X,
  ArrowLeft,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| IDEIGLENES BEJELENTKEZETT FELHASZNÁLÓ
|--------------------------------------------------------------------------
| Később ez az adat az autentikációból / adatbázisból érkezik.
*/

const CURRENT_USER = {
  id: 1,
  name: "Felhasználó",
  email: "felhasznalo@eto.hu",
  phone: "+36 30 123 4567",
  role: "Biztonsági vezető",
};


/*
|--------------------------------------------------------------------------
| REGISZTRÁLT FELHASZNÁLÓK
|--------------------------------------------------------------------------
| Admin jogosultság esetén ezek jelennek meg.
| Később adatbázisból érkeznek.
*/

const REGISTERED_USERS = [
  {
    id: 1,
    name: "Felhasználó",
    email: "felhasznalo@eto.hu",
    phone: "+36 30 123 4567",
    role: "Biztonsági vezető",
  },
  {
    id: 2,
    name: "Adminisztrátor",
    email: "admin@eto.hu",
    phone: "+36 30 987 6543",
    role: "Admin",
  },
  {
    id: 3,
    name: "Biztonsági vezető 2",
    email: "biztonsag2@eto.hu",
    phone: "+36 30 111 2233",
    role: "Biztonsági vezető",
  },
];


/*
|--------------------------------------------------------------------------
| RÁBA ETO HIVATALOS ADATAI
|--------------------------------------------------------------------------
*/

const ETO_DATA = {
  organization: "Rába ETO SE Győr",
  email: "info@eto.hu",
  phone: "+36 96 123 456",
  address: "9027 Győr, ETO Park",
};


/*
|--------------------------------------------------------------------------
| SZERVEZETI TÖRZSADATOK
|--------------------------------------------------------------------------
*/

const MASTER_DATA = {
  organizer: "Rába ETO SE Győr",
  chiefOrganizer: "Főnév Sándor",
  healthcareProvider: "ETO Egészségügyi Partner Kft.",
  disasterProtectionProvider:
    "ETO Katasztrófavédelmi Partner Kft.",
  reportEmail: "esemenynaplo@eto.hu",
};


function ProfilePage({
  currentUser = CURRENT_USER,
}) {
  /*
  |--------------------------------------------------------------------------
  | KIVÁLASZTOTT FELHASZNÁLÓ
  |--------------------------------------------------------------------------
  | null:
  |   saját profil
  |
  | user objektum:
  |   Admin által kiválasztott másik felhasználó
  */

  const [selectedUser, setSelectedUser] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | PROFIL SZERKESZTÉSE
  |--------------------------------------------------------------------------
  */

  const [editingProfile, setEditingProfile] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | JELSZÓ VÁLTOZTATÁSA
  |--------------------------------------------------------------------------
  */

  const [changingPassword, setChangingPassword] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | AKTUÁLISAN MEGJELENÍTETT FELHASZNÁLÓ
  |--------------------------------------------------------------------------
  */

  const isAdmin = currentUser.role === "Admin";

  const displayedUser =
    selectedUser || currentUser;


  /*
  |--------------------------------------------------------------------------
  | PROFIL ŰRLAP
  |--------------------------------------------------------------------------
  */

  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
  });


  /*
  |--------------------------------------------------------------------------
  | JELSZÓ ŰRLAP
  |--------------------------------------------------------------------------
  */

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  /*
  |--------------------------------------------------------------------------
  | PROFILADATOK MÓDOSÍTÁSA
  |--------------------------------------------------------------------------
  */

  const handleProfileChange = (
    field,
    value
  ) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /*
  |--------------------------------------------------------------------------
  | PROFIL MENTÉSE
  |--------------------------------------------------------------------------
  */

  const saveProfile = () => {
    /*
     * Jelenleg csak lokális tesztelés.
     *
     * Később:
     *
     * PUT /api/users/:id
     */

    console.log(
      "Profil mentése:",
      profileForm
    );

    setEditingProfile(false);
  };


  /*
  |--------------------------------------------------------------------------
  | JELSZÓ ŰRLAP MÓDOSÍTÁSA
  |--------------------------------------------------------------------------
  */

  const handlePasswordChange = (
    field,
    value
  ) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /*
  |--------------------------------------------------------------------------
  | JELSZÓ MENTÉSE
  |--------------------------------------------------------------------------
  */

  const savePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      alert(
        "Minden jelszómezőt ki kell tölteni."
      );

      return;
    }


    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      alert(
        "Az új jelszavak nem egyeznek."
      );

      return;
    }


    /*
     * Jelenleg csak tesztelési célú működés.
     *
     * Később:
     *
     * PUT /api/users/:id/password
     */

    console.log(
      "Jelszó módosítása"
    );


    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });


    setChangingPassword(false);
  };


  /*
  |--------------------------------------------------------------------------
  | PROFIL SZERKESZTÉS MEGSZAKÍTÁSA
  |--------------------------------------------------------------------------
  */

  const cancelProfileEdit = () => {
    setProfileForm({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
    });

    setEditingProfile(false);
  };


  /*
  |--------------------------------------------------------------------------
  | MÁSik FELHASZNÁLÓ KIVÁLASZTÁSA
  |--------------------------------------------------------------------------
  */

  const handleUserSelect = (user) => {
    setSelectedUser(user);

    setEditingProfile(false);
    setChangingPassword(false);
  };


  /*
  |--------------------------------------------------------------------------
  | SAJÁT PROFILRA VISSZALÉPÉS
  |--------------------------------------------------------------------------
  */

  const handleBackToOwnProfile = () => {
    setSelectedUser(null);
    setEditingProfile(false);
    setChangingPassword(false);

    setProfileForm({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
    });
  };


  return (
    <div className="space-y-6">


      {/* ====================================================
          PROFIL FEJLÉC
          ==================================================== */}

      <div className="rounded-2xl bg-white shadow overflow-hidden">

        <div className="bg-[#2E7D32] px-6 py-5 text-white">

          <div className="flex items-center gap-4">

            <div className="rounded-full bg-[#C19A5B] p-3">
              <User
                size={30}
                className="text-black"
              />
            </div>


            <div>

              <h2 className="text-xl font-semibold">
                {displayedUser.name}
              </h2>

              <div className="mt-1 flex items-center gap-2">

                <Shield size={15} />

                <span className="text-sm">
                  {displayedUser.role}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================
          ADMIN - VISSZA A SAJÁT PROFILHOZ
          ==================================================== */}

      {isAdmin && selectedUser && (

        <button
          type="button"
          onClick={handleBackToOwnProfile}
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            border
            border-gray-200
            bg-white
            px-4
            py-2
            text-sm
            text-gray-700
            shadow-sm
            transition
            hover:bg-gray-50
          "
        >

          <ArrowLeft size={16} />

          Saját profil

        </button>

      )}


      {/* ====================================================
          FELHASZNÁLÓI + RÁBA ETO ADATOK
          ==================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


        {/* ==================================================
            FELHASZNÁLÓI ADATOK
            ================================================== */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="mb-5 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="rounded-full bg-[#C19A5B] p-3">

                <User size={22} />

              </div>


              <div>

                <h2 className="text-lg font-semibold">
                  Felhasználói adatok
                </h2>

                <span
                  className={`
                    mt-1
                    inline-block
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-medium
                    ${
                      displayedUser.role === "Admin"
                        ? "bg-[#C19A5B] text-black"
                        : "bg-[#e8f5e9] text-[#2E7D32]"
                    }
                  `}
                >
                  {displayedUser.role}
                </span>

              </div>

            </div>


            {/* SZERKESZTÉS GOMB
                Csak a saját profilnál */}

            {!selectedUser && !editingProfile && (

              <button
                type="button"
                onClick={() =>
                  setEditingProfile(true)
                }
                className="
                  rounded-lg
                  p-2
                  text-gray-600
                  transition
                  hover:bg-gray-100
                  hover:text-black
                "
                title="Profil szerkesztése"
              >

                <Pencil size={19} />

              </button>

            )}

          </div>


          {/* =================================================
              PROFIL MEGTEKINTÉSE
              ================================================= */}

          {!editingProfile && (

            <div className="space-y-4">


              {/* NÉV */}

              <div>

                <label className="text-xs font-semibold text-gray-500">
                  Név
                </label>

                <div className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  {displayedUser.name}
                </div>

              </div>


              {/* E-MAIL */}

              <div>

                <label className="text-xs font-semibold text-gray-500">
                  E-mail
                </label>

                <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

                  <Mail
                    size={16}
                    className="text-gray-500"
                  />

                  {displayedUser.email}

                </div>

              </div>


              {/* TELEFONSZÁM */}

              <div>

                <label className="text-xs font-semibold text-gray-500">
                  Telefonszám
                </label>

                <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

                  <Phone
                    size={16}
                    className="text-gray-500"
                  />

                  {displayedUser.phone}

                </div>

              </div>


              {/* JOGOSULTSÁG */}

              <div>

                <label className="text-xs font-semibold text-gray-500">
                  Jogosultság
                </label>

                <div
                  className={`
                    mt-1
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    ${
                      displayedUser.role === "Admin"
                        ? "bg-[#C19A5B] text-black"
                        : "bg-[#e8f5e9] text-[#2E7D32]"
                    }
                  `}
                >

                  <Shield size={16} />

                  {displayedUser.role}

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              PROFIL SZERKESZTÉSE
              ================================================= */}

          {editingProfile && (

            <div className="space-y-4">


              {/* NÉV */}

              <div>

                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  Név
                </label>

                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    handleProfileChange(
                      "name",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-3
                    py-2
                    text-sm
                    outline-none
                    focus:border-[#2E7D32]
                  "
                />

              </div>


              {/* E-MAIL */}

              <div>

                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  E-mail
                </label>

                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    handleProfileChange(
                      "email",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-3
                    py-2
                    text-sm
                    outline-none
                    focus:border-[#2E7D32]
                  "
                />

              </div>


              {/* TELEFONSZÁM */}

              <div>

                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  Telefonszám
                </label>

                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) =>
                    handleProfileChange(
                      "phone",
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-3
                    py-2
                    text-sm
                    outline-none
                    focus:border-[#2E7D32]
                  "
                />

              </div>


              {/* JOGOSULTSÁG */}

              <div>

                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  Jogosultság
                </label>

                <div className="
                  rounded-lg
                  bg-gray-100
                  px-3
                  py-2
                  text-sm
                  text-gray-600
                ">
                  {displayedUser.role}
                </div>

              </div>


              {/* GOMBOK */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={saveProfile}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-[#2E7D32]
                    px-4
                    py-2
                    text-sm
                    text-white
                    transition
                    hover:bg-[#256628]
                  "
                >

                  <Save size={17} />

                  Mentés

                </button>


                <button
                  type="button"
                  onClick={cancelProfileEdit}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-gray-200
                    px-4
                    py-2
                    text-sm
                    transition
                    hover:bg-gray-300
                  "
                >

                  <X size={17} />

                  Mégsem

                </button>

              </div>

            </div>

          )}


          {/* =================================================
              JELSZÓ VÁLTOZTATÁSA
              Csak a saját profilnál
              ================================================= */}

          {!selectedUser && (

            <div className="mt-6 border-t border-gray-200 pt-5">


              {!changingPassword && (

                <button
                  type="button"
                  onClick={() =>
                    setChangingPassword(true)
                  }
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-[#2E7D32]
                    hover:underline
                  "
                >

                  <KeyRound size={18} />

                  Jelszó változtatása

                </button>

              )}


              {changingPassword && (

                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <h3 className="font-semibold">
                      Jelszó változtatása
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        setChangingPassword(false)
                      }
                      className="rounded-lg p-1 hover:bg-gray-100"
                    >

                      <X size={18} />

                    </button>

                  </div>


                  {/* JELENLEGI JELSZÓ */}

                  <div>

                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Jelenlegi jelszó
                    </label>

                    <input
                      type="password"
                      value={
                        passwordForm.currentPassword
                      }
                      onChange={(e) =>
                        handlePasswordChange(
                          "currentPassword",
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-2
                        text-sm
                        outline-none
                        focus:border-[#2E7D32]
                      "
                    />

                  </div>


                  {/* ÚJ JELSZÓ */}

                  <div>

                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Új jelszó
                    </label>

                    <input
                      type="password"
                      value={
                        passwordForm.newPassword
                      }
                      onChange={(e) =>
                        handlePasswordChange(
                          "newPassword",
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-2
                        text-sm
                        outline-none
                        focus:border-[#2E7D32]
                      "
                    />

                  </div>


                  {/* ÚJ JELSZÓ MEGERŐSÍTÉSE */}

                  <div>

                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                      Új jelszó újra
                    </label>

                    <input
                      type="password"
                      value={
                        passwordForm.confirmPassword
                      }
                      onChange={(e) =>
                        handlePasswordChange(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-2
                        text-sm
                        outline-none
                        focus:border-[#2E7D32]
                      "
                    />

                  </div>


                  {/* JELSZÓ MENTÉSE */}

                  <button
                    type="button"
                    onClick={savePassword}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      bg-[#2E7D32]
                      px-4
                      py-2
                      text-sm
                      text-white
                      transition
                      hover:bg-[#256628]
                    "
                  >

                    <Save size={17} />

                    Jelszó mentése

                  </button>

                </div>

              )}

            </div>

          )}

        </div>


        {/* ==================================================
            RÁBA ETO HIVATALOS ADATOK
            ================================================== */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-full bg-[#C19A5B] p-3">

              <Building2 size={22} />

            </div>


            <h2 className="text-lg font-semibold">
              Rába ETO hivatalos adatok
            </h2>

          </div>


          <div className="space-y-4">


            {/* SZERVEZET */}

            <div>

              <label className="text-xs font-semibold text-gray-500">
                Szervezet
              </label>

              <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

                <Building2
                  size={16}
                  className="text-gray-500"
                />

                {ETO_DATA.organization}

              </div>

            </div>


            {/* E-MAIL */}

            <div>

              <label className="text-xs font-semibold text-gray-500">
                E-mail
              </label>

              <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

                <Mail
                  size={16}
                  className="text-gray-500"
                />

                {ETO_DATA.email}

              </div>

            </div>


            {/* TELEFON */}

            <div>

              <label className="text-xs font-semibold text-gray-500">
                Telefonszám
              </label>

              <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

                <Phone
                  size={16}
                  className="text-gray-500"
                />

                {ETO_DATA.phone}

              </div>

            </div>


            {/* CÍM */}

            <div>

              <label className="text-xs font-semibold text-gray-500">
                Cím
              </label>

              <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

                <MapPin
                  size={16}
                  className="text-gray-500"
                />

                {ETO_DATA.address}

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================
          SZERVEZETI TÖRZSADATOK
          ==================================================== */}

      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-5 flex items-center gap-3">

          <div className="rounded-full bg-[#C19A5B] p-3">

            <Building2 size={22} />

          </div>


          <div>

            <h2 className="text-lg font-semibold">
              Szervezet által biztosított törzsadatok
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Az eseménynaplók kitöltése során használt szervezeti adatok.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


          {/* RENDEZŐ SZERVEZET */}

          <div>

            <label className="text-xs font-semibold text-gray-500">
              Rendező szervezet
            </label>

            <div className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm">
              {MASTER_DATA.organizer}
            </div>

          </div>


          {/* FŐRENDEZŐ */}

          <div>

            <label className="text-xs font-semibold text-gray-500">
              Főrendező
            </label>

            <div className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm">
              {MASTER_DATA.chiefOrganizer}
            </div>

          </div>


          {/* EGÉSZSÉGÜGYI BIZTOSÍTÓ */}

          <div>

            <label className="text-xs font-semibold text-gray-500">
              Egészségügyi biztosító
            </label>

            <div className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm">
              {MASTER_DATA.healthcareProvider}
            </div>

          </div>


          {/* KATASZTRÓFAVÉDELMI BIZTOSÍTÓ */}

          <div>

            <label className="text-xs font-semibold text-gray-500">
              Katasztrófavédelmi biztosító
            </label>

            <div className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm">
              {MASTER_DATA.disasterProtectionProvider}
            </div>

          </div>


          {/* ESEMÉNYNAPLÓ FOGADÓ E-MAIL */}

          <div>

            <label className="text-xs font-semibold text-gray-500">
              Eseménynapló fogadó e-mail
            </label>

            <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

              <Mail
                size={16}
                className="text-gray-500"
              />

              {MASTER_DATA.reportEmail}

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================
          ADMIN - REGISZTRÁLT FELHASZNÁLÓK
          ==================================================== */}

      {isAdmin && !selectedUser && (

        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="mb-4 flex items-center gap-3">

            <div className="rounded-full bg-[#C19A5B] p-3">

              <Shield size={22} />

            </div>


            <div>

              <h2 className="text-lg font-semibold">
                Regisztrált felhasználók
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                A regisztrált felhasználók profiljának megtekintése.
              </p>

            </div>

          </div>


          <div className="overflow-hidden rounded-xl border border-gray-200">

            <table className="w-full text-sm">

              <thead className="bg-[#2E7D32] text-left text-white">

                <tr>

                  <th className="p-3">
                    Név
                  </th>

                  <th className="p-3">
                    E-mail
                  </th>

                  <th className="p-3">
                    Jogosultság
                  </th>

                </tr>

              </thead>


              <tbody>

                {REGISTERED_USERS.map(
                  (user) => (

                    <tr
                      key={user.id}
                      onClick={() =>
                        handleUserSelect(user)
                      }
                      className="
                        cursor-pointer
                        border-t
                        border-gray-200
                        transition
                        hover:bg-gray-50
                      "
                    >

                      <td className="p-3 font-medium">
                        {user.name}
                      </td>


                      <td className="p-3 text-gray-600">
                        {user.email}
                      </td>


                      <td className="p-3">

                        <span
                          className={`
                            rounded-full
                            px-2
                            py-1
                            text-xs
                            ${
                              user.role === "Admin"
                                ? "bg-[#C19A5B] text-black"
                                : "bg-[#e8f5e9] text-[#2E7D32]"
                            }
                          `}
                        >
                          {user.role}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default ProfilePage;