import "./index.css";
import MonthlyfeeGeneratorComponent from "../../assets/components/MonthlyfeeGeneratorComponent";

const CreateMensalDonation = () => {
  return (
    <main className="mainAdmin_manager">
      <div className="adminManager_forms">
        <form className="form_adminManager">
          <MonthlyfeeGeneratorComponent />
        </form>
      </div>
    </main>
  );
};

export default CreateMensalDonation;
