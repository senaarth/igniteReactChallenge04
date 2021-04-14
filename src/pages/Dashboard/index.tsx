import { useState, useEffect } from "react";

import api from "../../services/api";
import { Header } from "../../components/Header";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

interface IFoodData {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface IAddFood {
  name: string;
  description: string;
  price: string;
  image: string;
}

function Dashboard() {
  const [foods, setFoods] = useState<IFoodData[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodData>({} as IFoodData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFoods() {
      const res = await api.get("/foods");
      setFoods(res.data);
    }
    getFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodData, "id" | "available">
  ): Promise<void> {
    try {
      const res = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, res.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: IAddFood): Promise<void> {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodData) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
