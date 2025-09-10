import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";

import Empty from "./MyEmpty";
import MediumBtn from "../../components/button/MediumBtn";
import GatherList from "../../components/mypage/GatherList";
import Modal from "../../components/modal/Modal";

export const groups = [
  {
    id: 1,
    name: "Shin_Han",
    members: ["신다운", "한주원"],
    linkedCard: { name: "HJW BABO 체크" },
    isOwner: true,
  },
  {
    id: 2,
    name: "신한DS 맛집탐방패밀리",
    members: ["한주원", "신다운", "오선정", "서가은", "박지원", "정재웅"],
    linkedCard: { name: "MUKJJANG 체크" },
    isOwner: false,
  },
  {
    id: 3,
    name: "가족",
    members: ["아빠", "엄마", "언니", "신다운"],
    linkedCard: { name: "FAMILY 체크" },
    isOwner: false,
  },
];

export default function MyGather() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalGroup, setModalGroup] = useState("");
  const [modalType, setModalType] = useState(2);
  const [modalAction, setModalAction] = useState(""); // "delete" or "leave"

  const handleCreatePlan = () => {
    navigate("/trip");
  };

  const isEmpty = groups.length === 0;

  return (
    <Wrapper isEmpty={isEmpty}>
      {isEmpty ? (
        <Empty
          title="아직 모임이 없어요."
          desc="여행 계획을 세우면 모임을 만들 수 있어요."
          action={
            <MediumBtn
              label="계획 세우기"
              onClick={handleCreatePlan}
              bgColor={colors.blue400}
              textColor={colors.white}
              width={180}
            />
          }
        />
      ) : (
        <ListWrap>
          {groups.map((g) => (
            <GatherList
              key={g.id}
              name={g.name}
              members={g.members}
              isOwner={g.isOwner}
              linkedCard={g.linkedCard}
              onAddMember={() => {
                setModalGroup(g.name);
                setModalType(2);
                setIsModalOpen(true);
                setModalAction("");
              }}
              onDelete={() => {
                setModalGroup(g.name);
                setModalType(1);
                setIsModalOpen(true);
                setModalAction("delete");
              }}
              onLeave={() => {
                setModalGroup(g.name);
                setModalType(1);
                setIsModalOpen(true);
                setModalAction("leave");
              }}
            />
          ))}
        </ListWrap>
      )}
      {isModalOpen && (
        <Modal
          title={
            modalType === 1
              ? modalAction === "delete"
                ? "모임 삭제"
                : "모임 탈퇴"
              : "멤버 초대"
          }
          def1={
            modalType === 1
              ? modalAction === "delete"
                ? `정말 '${modalGroup}' 모임을 삭제하시겠어요?`
                : `정말 '${modalGroup}' 모임을 탈퇴하시겠어요?`
              : `'${modalGroup}'에 멤버를 추가할 수 있습니다.`
          }
          def2={
            modalType === 1
              ? modalAction === "delete"
                ? "삭제한 모임과 연결된 모든 여행 기록도 사라집니다."
                : "탈퇴한 모임과 연결된 모든 여행 기록이 사라집니다."
              : "Triplet 계정이 있어야 함께할 수 있어요."
          }
          type={modalType}
          btnLabel={modalType === 1 ? "취소" : undefined}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.gray200};
  border-radius: 12px;
  box-shadow: ${shadows.card};
  min-height: 420px;
  padding: 30px 70px;

  display: grid;
  grid-auto-rows: min-content;
  row-gap: 20px;

  ${({ isEmpty }) =>
    isEmpty &&
    `
    place-content: center;
    place-items: center;
  `}
`;

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

