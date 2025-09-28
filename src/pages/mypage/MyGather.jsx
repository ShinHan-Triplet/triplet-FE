import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import colors from "../../styles/colors";
import shadows from "../../styles/shadows";

import Empty from "./MyEmpty";
import MediumBtn from "../../components/button/MediumBtn";
import GatherList from "../../components/mypage/GatherList";
import Modal from "../../components/modal/Modal";

import { api } from "../../lib/api";

export default function MyGather() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalGroup, setModalGroup] = useState("");
  const [modalType, setModalType] = useState(2);
  const [modalAction, setModalAction] = useState(""); // "delete" 또는 "leave"

  const [selected, setSelected] = useState(null);
  const [acting, setActing] = useState(false);

  const handleCreatePlan = () => {
    navigate("/trip");
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api("/api/mypage/gather");
        if (!mounted) return;

        const uiGroups = (Array.isArray(data) ? data : []).map((g) => ({
          id: g.gatherId,
          name: g.gatherName,
          members: Array.isArray(g.members) ? g.members : [],
          linkedCard: g.cardNickname ? { name: g.cardNickname } : null,
          isOwner: !!g.owner,
        }));

        setGroups(uiGroups);
        setLoadError("");
      } catch (e) {
        console.error(
          "GET /api/mypage/gather failed:",
          e?.status,
          e?.body || e?.message
        );
        if (mounted) setLoadError("내 모임을 불러오지 못했어요.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleConfirm = async () => {
    if (acting || !selected) return;
    try {
      setActing(true);

      if (modalAction === "delete") {
        await api(`/api/mypage/gather/${selected.id}`, { method: "DELETE" });
      } else if (modalAction === "leave") {
        await api(`/api/mypage/gather/${selected.id}/leave`, { method: "DELETE" });
      } else {
        return;
      }

      // 목록에서 제거
      setGroups(prev => prev.filter(g => g.id !== selected.id));

      // 모달 닫기 & 선택 해제
      setIsModalOpen(false);
      setSelected(null);
    } catch (e) {
      alert(e?.response?.data || e?.body || e?.message || "처리에 실패했습니다.");
    } finally {
      setActing(false);
    }
  };

  const isEmpty = groups.length === 0;

  return (
    <Wrapper $isEmpty={isEmpty}>
      {loading ? (
        <div style={{ color: colors.gray700 }}>불러오는 중...</div>
      ) : loadError ? (
        <div style={{ color: colors.error }}>{loadError}</div>
      ) : isEmpty ? (
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
                setSelected({ id: g.id, name: g.name });
                setModalGroup(g.name);
                setModalType(1);
                setModalAction("delete");
                setIsModalOpen(true);
              }}
              onLeave={() => {
                setSelected({ id: g.id, name: g.name });
                setModalGroup(g.name);
                setModalType(1);
                setModalAction("leave");
                setIsModalOpen(true);
              }}
            />
          ))}
        </ListWrap>
      )}

      {isModalOpen && (
        <Modal
          title={
            modalType === 1
              ? modalAction === "delete" ? "모임 삭제" : "모임 탈퇴"
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
                ? "삭제 시 모임과 연결된 모든 여행 기록이 함께 삭제됩니다."
                : "탈퇴 시 이 모임의 여행기록에 더 이상 접근할 수 없습니다."
              : "Triplet 계정이 있어야 함께할 수 있어요."
          }
          type={modalType}
          btnLabel={modalType === 1 ? "취소" : undefined}
          onClose={() => {
            if (!acting) {
              setIsModalOpen(false);
              setSelected(null);
              setModalAction("");
            }
          }}
          
          func1={() => { }}
          func2={() => { if (!acting) handleConfirm(); }}
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

  ${({ $isEmpty }) =>
    $isEmpty &&
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
