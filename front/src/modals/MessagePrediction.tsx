import { Button, Modal } from "flowbite-react";

interface Props {
  modelName: string;
  prediction: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MessagePrediction({
  modelName,
  prediction,
  openModal,
  setOpenModal,
}: Props) {
  return (
    <>
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        position={"top-center"}
      >
        <Modal.Header>Prediction made by {modelName}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 ">
              The image diagnosis indicates that the result is:
              <span className="font-bold"> {prediction}</span>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-red-950" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
