import React, { useEffect, useState } from "react";
import { getCampains } from "../../helper/getCampains";
import { ICONS } from "../../constants/constants";
import { updateCampains } from "../../helper/updateCampains";
import { deleteCampain } from "../../helper/deleteCampain";
import { insertNewCampain } from "../../helper/insertNewCampain";
import { toast } from "react-toastify";

const Campain = () => {
  const [campains, setCampains] = useState([]);
  const [newCampain, setNewCampain] = useState();
  const [inEdit, setInEdit] = useState();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const campain = async () => {
      const response = await getCampains();
      setCampains(response);
    };
    campain();
  }, [inEdit, reload]);

  const handleChange = (id, field, value) => {
    const update = campains.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setCampains(update);
  };

  const handleEdit = async (id) => {
    if (inEdit) {
      const updateCampain = campains.find((c) => c.id === id);
      await updateCampains(updateCampain);
      setInEdit();
    } else {
      setInEdit(id);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja mesmo deletar esta campanha?")) {
      await deleteCampain(id);
      setReload(prev => !prev);
    }
  };

  const handleNewCampain = async () => {
    if (newCampain === "") {
      toast.warning("Preencha o campo 'Nova Campanha' corretamente...");
      return;
    }
    await insertNewCampain(newCampain);
    setReload(prev => !prev)
    setNewCampain("");
  };

  return (
    <div className="campain">
      <div className="campain-divs">
        <div className="campain-divs-body">
          <label>Campanhas</label>
          <div className="campain-divs-body-campains">
            {campains?.map((cp) => (
              <div key={cp.id} className="campain-divs-body-campains-itens">
                <input
                  type="text"
                  value={cp.campain_name || ""}
                  onChange={(e) =>
                    handleChange(cp.id, "campain_name", e.target.value)
                  }
                  readOnly={inEdit !== cp.id}
                />
                <div className="campain-divs-body-campains-itens-icons">
                  <p onClick={() => handleEdit(cp.id)}>
                    {inEdit !== cp.id ? ICONS.EDIT : ICONS.CONFIRMED}
                  </p>
                  <p onClick={() => handleDelete(cp.id)}>{ICONS.TRASH}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="campain-divs-bottom">
          <div className="input-field">
            <label>Nova Campanha</label>
            <input
              value={newCampain}
              type="text"
              onChange={(e) => setNewCampain(e.target.value)}
            />
          </div>
          <button onClick={handleNewCampain}>Add</button>
        </div>
      </div>

      <div className="campain-divs"></div>
      <div></div>
    </div>
  );
};

export default Campain;
