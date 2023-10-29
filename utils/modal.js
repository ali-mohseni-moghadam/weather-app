const modal = document.querySelector("#modal");
const modalText = modal.querySelector("p");

const showModal = (text) => {
  modalText.innerText = text;
  modal.style.display = "flex";
};

const removeModal = () => {
  modal.style.display = "none";
};

export { showModal, removeModal };
