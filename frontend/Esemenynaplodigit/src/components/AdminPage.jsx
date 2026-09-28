import { useState } from "react";

import {
  User,
  Shield,
  Building2,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Save,
  X,
  Trash2,
  Plus,
  Settings,
  Database,
  Info,
  Users,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| IDEIGLENES FELHASZNÁLÓLISTA
|--------------------------------------------------------------------------
| Később adatbázisból érkezik.
*/

const INITIAL_USERS = [
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
| RÁBA ETO TÖRZSADATOK
|--------------------------------------------------------------------------
*/

const INITIAL_MASTER_DATA = {
  organization: "Rába ETO SE Győr",
  chiefOrganizer: "Főnév Sándor",
  healthcareProvider: "ETO Egészségügyi Partner Kft.",
  disasterProtectionProvider:
    "ETO Katasztrófavédelmi Partner Kft.",
  reportEmail: "esemenynaplo@eto.hu",
  organizationEmail: "info@eto.hu",
  organizationPhone: "+36 96 123 456",
  organizationAddress: "9027 Győr, ETO Park",
};

/*
|--------------------------------------------------------------------------
| ADMIN PAGE
|--------------------------------------------------------------------------
*/

function AdminPage() {
  /*
  |--------------------------------------------------------------------------
  | OLDALSÓ ADMIN MENÜ
  |--------------------------------------------------------------------------
  */

  const [activeSection, setActiveSection] = useState("users");

  /*
  |--------------------------------------------------------------------------
  | FELHASZNÁLÓK
  |--------------------------------------------------------------------------
  */

  const [users, setUsers] = useState(INITIAL_USERS);

  const [selectedUser, setSelectedUser] = useState(null);

  const [editingUser, setEditingUser] = useState(false);

  const [addingUser, setAddingUser] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | ÚJ / SZERKESZTETT FELHASZNÁLÓ ADATAI
  |--------------------------------------------------------------------------
  */

  const emptyUser = {
    name: "",
    email: "",
    phone: "",
    role: "Biztonsági vezető",
  };

  const [userForm, setUserForm] = useState(emptyUser);

  /*
  |--------------------------------------------------------------------------
  | TÖRZSADATOK
  |--------------------------------------------------------------------------
  */

  const [masterData, setMasterData] = useState(
    INITIAL_MASTER_DATA
  );

  const [editingMasterData, setEditingMasterData] =
    useState(false);

  const [masterDataForm, setMasterDataForm] =
    useState(INITIAL_MASTER_DATA);

  /*
  |--------------------------------------------------------------------------
  | FELHASZNÁLÓ ŰRLAP MÓDOSÍTÁSA
  |--------------------------------------------------------------------------
  */

  const handleUserFormChange = (field, value) => {
    setUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | ÚJ FELHASZNÁLÓ
  |--------------------------------------------------------------------------
  */

  const startAddUser = () => {
    setSelectedUser(null);
    setEditingUser(false);
    setUserForm(emptyUser);
    setAddingUser(true);
  };

  /*
  |--------------------------------------------------------------------------
  | FELHASZNÁLÓ KIVÁLASZTÁSA
  |--------------------------------------------------------------------------
  */

  const selectUser = (user) => {
    setSelectedUser(user);

    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    setAddingUser(false);
    setEditingUser(false);
  };

  /*
  |--------------------------------------------------------------------------
  | FELHASZNÁLÓ SZERKESZTÉS
  |--------------------------------------------------------------------------
  */

  const startEditUser = () => {
    if (!selectedUser) {
      return;
    }

    setUserForm({
      name: selectedUser.name,
      email: selectedUser.email,
      phone: selectedUser.phone,
      role: selectedUser.role,
    });

    setEditingUser(true);
  };

  /*
  |--------------------------------------------------------------------------
  | FELHASZNÁLÓ MENTÉSE
  |--------------------------------------------------------------------------
  */

  const saveUser = () => {
    if (
      !userForm.name.trim() ||
      !userForm.email.trim() ||
      !userForm.phone.trim()
    ) {
      alert("A név, e-mail és telefonszám megadása kötelező.");

      return;
    }

    /*
     * ÚJ FELHASZNÁLÓ
     */

    if (addingUser) {
      const newUser = {
        id: Date.now(),
        ...userForm,
      };

      setUsers((prev) => [
        ...prev,
        newUser,
      ]);

      setSelectedUser(newUser);
      setAddingUser(false);

      return;
    }

    /*
     * MEGLÉVŐ FELHASZNÁLÓ
     */

    if (editingUser && selectedUser) {
      const updatedUser = {
        ...selectedUser,
        ...userForm,
      };

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? updatedUser
            : user
        )
      );

      setSelectedUser(updatedUser);
      setEditingUser(false);
    }

    /*
     * KÉSŐBB:
     *
     * PUT /api/users/:id
     *
     * illetve új felhasználónál:
     *
     * POST /api/users
     */
  };

  /*
  |--------------------------------------------------------------------------
  | FELHASZNÁLÓ SZERKESZTÉS MEGSZAKÍTÁSA
  |--------------------------------------------------------------------------
  */

  const cancelUserEdit = () => {
    setEditingUser(false);
    setAddingUser(false);

    if (selectedUser) {
      setUserForm({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
      });
    } else {
      setUserForm(emptyUser);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FELHASZNÁLÓ TÖRLÉSE
  |--------------------------------------------------------------------------
  */

  const deleteUser = () => {
    if (!selectedUser) {
      return;
    }

    const confirmed = window.confirm(
      `Biztosan törölni szeretnéd ezt a felhasználót?\n\n${selectedUser.name}`
    );

    if (!confirmed) {
      return;
    }

    setUsers((prev) =>
      prev.filter(
        (user) => user.id !== selectedUser.id
      )
    );

    setSelectedUser(null);
    setEditingUser(false);
    setAddingUser(false);
  };

  /*
  |--------------------------------------------------------------------------
  | TÖRZSADAT MÓDOSÍTÁSA
  |--------------------------------------------------------------------------
  */

  const startEditMasterData = () => {
    setMasterDataForm(masterData);
    setEditingMasterData(true);
  };

  /*
  |--------------------------------------------------------------------------
  | TÖRZSADAT ŰRLAP MÓDOSÍTÁSA
  |--------------------------------------------------------------------------
  */

  const handleMasterDataChange = (
    field,
    value
  ) => {
    setMasterDataForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | TÖRZSADAT MENTÉSE
  |--------------------------------------------------------------------------
  */

  const saveMasterData = () => {
    setMasterData(masterDataForm);
    setEditingMasterData(false);

    /*
     * KÉSŐBB:
     *
     * PUT /api/master-data
     */
  };

  /*
  |--------------------------------------------------------------------------
  | TÖRZSADAT MÓDOSÍTÁS MEGSZAKÍTÁSA
  |--------------------------------------------------------------------------
  */

  const cancelMasterDataEdit = () => {
    setMasterDataForm(masterData);
    setEditingMasterData(false);
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">

      {/* =========================================================
          ADMIN FEJLÉC
          ========================================================= */}

      <div className="rounded-2xl bg-white shadow overflow-hidden">

        <div className="bg-[#2E7D32] px-6 py-5 text-white">

          <div className="flex items-center gap-4">

            <div className="rounded-full bg-[#C19A5B] p-3">

              <Shield
                size={30}
                className="text-black"
              />

            </div>

            <div>

              <h1 className="text-xl font-semibold">
                Adminisztráció
              </h1>

              <p className="mt-1 text-sm text-green-100">
                A rendszer felhasználóinak és szervezeti
                adatainak kezelése
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          ADMIN TARTALOM
          ========================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">

        {/* =======================================================
            ADMIN MENÜ
            ======================================================= */}

        <div className="rounded-2xl bg-white p-3 shadow">

          <button
            type="button"
            onClick={() =>
              setActiveSection("users")
            }
            className={`
              mb-1
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-left
              text-sm
              transition
              ${
                activeSection === "users"
                  ? "bg-[#2E7D32] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >

            <Users size={18} />

            Felhasználók

          </button>


          <button
            type="button"
            onClick={() =>
              setActiveSection("master-data")
            }
            className={`
              mb-1
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-left
              text-sm
              transition
              ${
                activeSection === "master-data"
                  ? "bg-[#2E7D32] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >

            <Building2 size={18} />

            Törzsadatok

          </button>


          <button
            type="button"
            onClick={() =>
              setActiveSection("system")
            }
            className={`
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-left
              text-sm
              transition
              ${
                activeSection === "system"
                  ? "bg-[#2E7D32] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >

            <Settings size={18} />

            Rendszer

          </button>

        </div>


        {/* =======================================================
            FELHASZNÁLÓK
            ======================================================= */}

        {activeSection === "users" && (

          <div className="space-y-6">

            <div className="rounded-2xl bg-white p-6 shadow">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="rounded-full bg-[#C19A5B] p-3">

                    <Users size={22} />

                  </div>

                  <div>

                    <h2 className="text-lg font-semibold">
                      Felhasználók kezelése
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      A rendszerben regisztrált felhasználók
                      és jogosultságaik kezelése.
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={startAddUser}
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

                  <Plus size={17} />

                  Új felhasználó

                </button>

              </div>


              {/* =================================================
                  FELHASZNÁLÓLISTA
                  ================================================= */}

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
                        Telefonszám
                      </th>

                      <th className="p-3">
                        Jogosultság
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {users.map((user) => (

                      <tr
                        key={user.id}
                        onClick={() =>
                          selectUser(user)
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

                        <td className="p-3 text-gray-600">
                          {user.phone}
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

                    ))}

                  </tbody>

                </table>

              </div>

            </div>


            {/* =================================================
                FELHASZNÁLÓ ADATAI
                ================================================= */}

            {(selectedUser || addingUser) && (

              <div className="rounded-2xl bg-white p-6 shadow">

                <div className="mb-5 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="rounded-full bg-[#C19A5B] p-3">

                      <User size={22} />

                    </div>

                    <div>

                      <h2 className="text-lg font-semibold">

                        {addingUser
                          ? "Új felhasználó"
                          : "Felhasználói adatok"}

                      </h2>

                      <p className="mt-1 text-sm text-gray-500">

                        {addingUser
                          ? "Új rendszerfelhasználó létrehozása."
                          : "A kiválasztott felhasználó adatainak kezelése."}

                      </p>

                    </div>

                  </div>


                  {!addingUser && !editingUser && (

                    <button
                      type="button"
                      onClick={startEditUser}
                      className="
                        rounded-lg
                        p-2
                        text-gray-600
                        transition
                        hover:bg-gray-100
                        hover:text-black
                      "
                      title="Felhasználó szerkesztése"
                    >

                      <Pencil size={19} />

                    </button>

                  )}

                </div>


                {/* =================================================
                    MEGTEKINTÉS
                    ================================================= */}

                {!addingUser && !editingUser && (

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>

                      <label className="text-xs font-semibold text-gray-500">
                        Név
                      </label>

                      <div className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                        {selectedUser.name}
                      </div>

                    </div>


                    <div>

                      <label className="text-xs font-semibold text-gray-500">
                        E-mail
                      </label>

                      <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

                        <Mail
                          size={16}
                          className="text-gray-500"
                        />

                        {selectedUser.email}

                      </div>

                    </div>


                    <div>

                      <label className="text-xs font-semibold text-gray-500">
                        Telefonszám
                      </label>

                      <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

                        <Phone
                          size={16}
                          className="text-gray-500"
                        />

                        {selectedUser.phone}

                      </div>

                    </div>


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
                            selectedUser.role === "Admin"
                              ? "bg-[#C19A5B] text-black"
                              : "bg-[#e8f5e9] text-[#2E7D32]"
                          }
                        `}
                      >

                        <Shield size={16} />

                        {selectedUser.role}

                      </div>

                    </div>

                  </div>

                )}


                {/* =================================================
                    SZERKESZTÉS / ÚJ FELHASZNÁLÓ
                    ================================================= */}

                {(addingUser || editingUser) && (

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>

                      <label className="mb-1 block text-xs font-semibold text-gray-500">
                        Név
                      </label>

                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) =>
                          handleUserFormChange(
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


                    <div>

                      <label className="mb-1 block text-xs font-semibold text-gray-500">
                        E-mail
                      </label>

                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) =>
                          handleUserFormChange(
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


                    <div>

                      <label className="mb-1 block text-xs font-semibold text-gray-500">
                        Telefonszám
                      </label>

                      <input
                        type="text"
                        value={userForm.phone}
                        onChange={(e) =>
                          handleUserFormChange(
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


                    <div>

                      <label className="mb-1 block text-xs font-semibold text-gray-500">
                        Jogosultság
                      </label>

                      <select
                        value={userForm.role}
                        onChange={(e) =>
                          handleUserFormChange(
                            "role",
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          rounded-lg
                          border
                          border-gray-300
                          bg-white
                          px-3
                          py-2
                          text-sm
                          outline-none
                          focus:border-[#2E7D32]
                        "
                      >

                        <option value="Biztonsági vezető">
                          Biztonsági vezető
                        </option>

                        <option value="Admin">
                          Admin
                        </option>

                      </select>

                    </div>


                    <div className="flex gap-3 pt-2 md:col-span-2">

                      <button
                        type="button"
                        onClick={saveUser}
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
                        onClick={cancelUserEdit}
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
                    TÖRLÉS
                    ================================================= */}

                {selectedUser &&
                  !addingUser &&
                  !editingUser && (

                    <div className="mt-6 border-t border-gray-200 pt-5">

                      <button
                        type="button"
                        onClick={deleteUser}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          border
                          border-red-200
                          px-4
                          py-2
                          text-sm
                          text-red-600
                          transition
                          hover:bg-red-50
                        "
                      >

                        <Trash2 size={17} />

                        Felhasználó törlése

                      </button>

                    </div>

                  )}

              </div>

            )}

          </div>

        )}


        {/* =========================================================
            TÖRZSADATOK
            ========================================================= */}

        {activeSection === "master-data" && (

          <div className="space-y-6">

            <div className="rounded-2xl bg-white p-6 shadow">

              <div className="mb-6 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="rounded-full bg-[#C19A5B] p-3">

                    <Building2 size={22} />

                  </div>

                  <div>

                    <h2 className="text-lg font-semibold">
                      Szervezeti törzsadatok
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Az eseménynaplókban automatikusan
                      felhasznált szervezeti adatok kezelése.
                    </p>

                  </div>

                </div>


                {!editingMasterData && (

                  <button
                    type="button"
                    onClick={startEditMasterData}
                    className="
                      rounded-lg
                      p-2
                      text-gray-600
                      transition
                      hover:bg-gray-100
                      hover:text-black
                    "
                    title="Törzsadatok szerkesztése"
                  >

                    <Pencil size={19} />

                  </button>

                )}

              </div>


              {!editingMasterData && (

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <DataField
                    label="Rendező szervezet"
                    value={masterData.organization}
                  />

                  <DataField
                    label="Főrendező"
                    value={masterData.chiefOrganizer}
                  />

                  <DataField
                    label="Egészségügyi biztosító"
                    value={masterData.healthcareProvider}
                  />

                  <DataField
                    label="Katasztrófavédelmi biztosító"
                    value={
                      masterData.disasterProtectionProvider
                    }
                  />

                  <DataField
                    label="Eseménynapló fogadó e-mail"
                    value={masterData.reportEmail}
                    icon={<Mail size={16} />}
                  />

                  <DataField
                    label="Szervezeti e-mail"
                    value={masterData.organizationEmail}
                    icon={<Mail size={16} />}
                  />

                  <DataField
                    label="Szervezeti telefonszám"
                    value={masterData.organizationPhone}
                    icon={<Phone size={16} />}
                  />

                  <DataField
                    label="Szervezeti cím"
                    value={masterData.organizationAddress}
                    icon={<MapPin size={16} />}
                  />

                </div>

              )}


              {editingMasterData && (

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  <AdminInput
                    label="Rendező szervezet"
                    value={masterDataForm.organization}
                    onChange={(value) =>
                      handleMasterDataChange(
                        "organization",
                        value
                      )
                    }
                  />

                  <AdminInput
                    label="Főrendező"
                    value={masterDataForm.chiefOrganizer}
                    onChange={(value) =>
                      handleMasterDataChange(
                        "chiefOrganizer",
                        value
                      )
                    }
                  />

                  <AdminInput
                    label="Egészségügyi biztosító"
                    value={
                      masterDataForm.healthcareProvider
                    }
                    onChange={(value) =>
                      handleMasterDataChange(
                        "healthcareProvider",
                        value
                      )
                    }
                  />

                  <AdminInput
                    label="Katasztrófavédelmi biztosító"
                    value={
                      masterDataForm.disasterProtectionProvider
                    }
                    onChange={(value) =>
                      handleMasterDataChange(
                        "disasterProtectionProvider",
                        value
                      )
                    }
                  />

                  <AdminInput
                    label="Eseménynapló fogadó e-mail"
                    value={masterDataForm.reportEmail}
                    onChange={(value) =>
                      handleMasterDataChange(
                        "reportEmail",
                        value
                      )
                    }
                  />

                  <AdminInput
                    label="Szervezeti e-mail"
                    value={
                      masterDataForm.organizationEmail
                    }
                    onChange={(value) =>
                      handleMasterDataChange(
                        "organizationEmail",
                        value
                      )
                    }
                  />

                  <AdminInput
                    label="Szervezeti telefonszám"
                    value={
                      masterDataForm.organizationPhone
                    }
                    onChange={(value) =>
                      handleMasterDataChange(
                        "organizationPhone",
                        value
                      )
                    }
                  />

                  <AdminInput
                    label="Szervezeti cím"
                    value={
                      masterDataForm.organizationAddress
                    }
                    onChange={(value) =>
                      handleMasterDataChange(
                        "organizationAddress",
                        value
                      )
                    }
                  />


                  <div className="flex gap-3 pt-2 md:col-span-2">

                    <button
                      type="button"
                      onClick={saveMasterData}
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
                      onClick={cancelMasterDataEdit}
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

            </div>


            {/* =================================================
                FONTOS INFORMÁCIÓ
                ================================================= */}

            <div className="rounded-2xl border border-green-100 bg-green-50 p-5">

              <div className="flex items-start gap-3">

                <Info
                  size={20}
                  className="mt-0.5 text-[#2E7D32]"
                />

                <div>

                  <h3 className="font-semibold text-[#2E7D32]">
                    Törzsadatok használata
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    A módosított adatok az újonnan létrehozott
                    eseménynaplók kitöltésekor automatikusan
                    felhasználhatók.
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}


        {/* =========================================================
            RENDSZER
            ========================================================= */}

        {activeSection === "system" && (

          <div className="space-y-6">

            <div className="rounded-2xl bg-white p-6 shadow">

              <div className="mb-6 flex items-center gap-3">

                <div className="rounded-full bg-[#C19A5B] p-3">

                  <Settings size={22} />

                </div>

                <div>

                  <h2 className="text-lg font-semibold">
                    Rendszerinformációk
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    A rendszer aktuális állapotának áttekintése.
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <SystemInfo
                  label="Rendszer neve"
                  value="Rába ETO Eseménynapló"
                />

                <SystemInfo
                  label="Verzió"
                  value="0.1.0"
                />

                <SystemInfo
                  label="Felhasználók száma"
                  value={`${users.length} fő`}
                />

                <SystemInfo
                  label="Adatbázis"
                  value="Kapcsolatra vár"
                />

                <SystemInfo
                  label="MLSZ adatkapcsolat"
                  value="Kapcsolatra vár"
                />

                <SystemInfo
                  label="PDF generálás"
                  value="Elérhető"
                />

              </div>

            </div>


            <div className="rounded-2xl bg-white p-6 shadow">

              <div className="flex items-start gap-4">

                <div className="rounded-full bg-[#e8f5e9] p-3">

                  <Database
                    size={22}
                    className="text-[#2E7D32]"
                  />

                </div>

                <div>

                  <h2 className="font-semibold">
                    Adatkezelés
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Az eseménynaplók és a kapcsolódó adatok
                    tartósan kerülnek tárolásra. A lezárt
                    eseménynaplók tartalma nem módosítható.
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| ADATMEZŐ
|--------------------------------------------------------------------------
*/

function DataField({
  label,
  value,
  icon,
}) {
  return (
    <div>

      <label className="text-xs font-semibold text-gray-500">
        {label}
      </label>

      <div className="mt-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">

        {icon && (
          <span className="text-gray-500">
            {icon}
          </span>
        )}

        {value}

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| ADMIN INPUT
|--------------------------------------------------------------------------
*/

function AdminInput({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-1 block text-xs font-semibold text-gray-500">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
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
  );
}


/*
|--------------------------------------------------------------------------
| RENDSZER INFORMÁCIÓ
|--------------------------------------------------------------------------
*/

function SystemInfo({
  label,
  value,
}) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3">

      <div className="text-xs font-semibold text-gray-500">
        {label}
      </div>

      <div className="mt-1 text-sm font-medium text-gray-800">
        {value}
      </div>

    </div>
  );
}


export default AdminPage;