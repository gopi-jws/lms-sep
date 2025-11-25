import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./ListOfQuestionsType.css";
import useBounceModal from "../../ReusableComponents/useBounceModal/useBounceModal"; // Import the custom hook

import {
    ListOrdered,
    Calculator,
    CheckSquare,
    AlignLeft,
} from "lucide-react";

import SAQModal from "../Questions-Types-Modals/SAQModal/SAQModal";
import MCQModal from "../../ReusableComponents/Questions-Types-Modals/MCQModal/MCQModal";
import NumericalModal from "../../ReusableComponents/Questions-Types-Modals/NumericalModal/NumericalModal";
import TrueFalseModal from "../../ReusableComponents/Questions-Types-Modals/TrueFalseModal/TrueFalseModal";
import DescriptiveModal from "../../ReusableComponents/Questions-Types-Modals/DescriptiveModal/DescriptiveModal";
import { addNewQuestionQB,setIsSQAModalOpen,setIsModalOpen,setIsNumericalModalOpen,setIsTrueFalseModalOpen,setIsDescriptiveModalOpen } from "../../../slices/addQuestionBank";


const ListOfQuestionsType = ({ isOpen, onClose }) => {

    if (!isOpen) return null;
    const { modalRef, isBouncing } = useBounceModal(isOpen); // Corrected line
   // const [isSQAModalOpen, setIsSQAModalOpen] = useState(false);
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [isNumericalModalOpen, setIsNumericalModalOpen] = useState(false);
    // const [isTrueFalseModalOpen, setIsTrueFalseModalOpen] = useState(false);
    // const [isDescriptiveModalOpen, setIsDescriptiveModalOpen] = useState(false);

    const dispatch = useDispatch();

    const handleClose = () =>{
        dispatch(addNewQuestionQB(false));
    }

    return (
        <div className="questiontypes-dropdown-menu">
            <div className={`${isBouncing ? "bounce" : ""}`} ref={modalRef}>
                <ul>
                    <li>
                        <Link
                            to="#"
                            className="questiontypes-dropdown-item"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(setIsSQAModalOpen(true));
                                handleClose();
                            }}
                        >
                            <ListOrdered className="icon" />
                            <span className="ps-2">SAQ</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className="questiontypes-dropdown-item"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(setIsModalOpen(true));
                                handleClose();
                            }}
                        >
                            <ListOrdered className="icon" />
                            <span className="ps-2">MAQ</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className="questiontypes-dropdown-item"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(setIsNumericalModalOpen(true));
                                handleClose();
                            }}
                        >
                            <Calculator className="icon" />
                            <span className="ps-2">Numerical</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className="questiontypes-dropdown-item"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(setIsTrueFalseModalOpen(true));
                                handleClose();
                            }}
                        >
                            <CheckSquare className="icon" />
                            <span className="ps-2">True/False</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className="questiontypes-dropdown-item"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(setIsDescriptiveModalOpen(true));
                                handleClose();
                            }}
                        >
                            <AlignLeft className="icon" />
                            <span className="ps-2">Descriptive</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* <SAQModal open={isSQAModalOpen} onClose={() => { setIsSQAModalOpen(false); handleClose() }} /> */}
            {/* <MCQModal open={isModalOpen} onClose={() => { setIsModalOpen(false); }} />
            <NumericalModal open={isNumericalModalOpen} onClose={() => { setIsNumericalModalOpen(false); handleClose() }} />
            <TrueFalseModal open={isTrueFalseModalOpen} onClose={() => { setIsTrueFalseModalOpen(false); handleClose() }} />
            <DescriptiveModal open={isDescriptiveModalOpen} onClose={() => { setIsDescriptiveModalOpen(false); handleClose() }} /> */}
        </div>
    );
};

export default ListOfQuestionsType;
