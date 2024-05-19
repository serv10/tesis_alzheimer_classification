import { Button, Modal } from "flowbite-react";
import { useState } from "react";

interface Props {
  modelName: string;
  prediction: string;
}

export default function MessagePrediction({ modelName, prediction }: Props) {
  const [openModal, setOpenModal] = useState(true);

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Prediction made by {modelName}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 ">
              The image diagnosis indicates that the result is:
              <span className="font-bold">{prediction}</span>
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
