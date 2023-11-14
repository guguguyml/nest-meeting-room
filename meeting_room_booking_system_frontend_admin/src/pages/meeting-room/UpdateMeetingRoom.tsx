import { Form, Input, InputNumber, Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect } from "react";
import { updateMeetingRoom, findMeetingRoom } from "@/api/meeting-room";
import { IEditMeetingRoom } from "@/interfaces/meeting-room";

interface UpdateMeetingRoomModalProps {
	id: number;
	isOpen: boolean;
	handleClose: Function;
}
const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 },
};

export function UpdateMeetingRoomModal(props: UpdateMeetingRoomModalProps) {
	const [form] = useForm<IEditMeetingRoom>();

	const handleOk = useCallback(async function () {
		const values = form.getFieldsValue();

		values.description = values.description || "";
		values.equipment = values.equipment || "";

		const res = await updateMeetingRoom({
			...values,
			id: form.getFieldValue("id"),
		});

		if (res.code === 201 || res.code === 200) {
			message.success("更新成功");
			props.handleClose();
		} else {
			message.error(res.data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		async function query() {
			if (!props.id) {
				return;
			}
			const res = await findMeetingRoom(props.id);

			const { data } = res;
			const flag = typeof data === "string";
			if (res.code === 200 || res.code === 201) {
				!flag && form.setFieldValue("id", data.id);
				!flag && form.setFieldValue("name", data.name);
				!flag && form.setFieldValue("location", data.location);
				!flag && form.setFieldValue("capacity", data.capacity);
				!flag && form.setFieldValue("equipment", data.equipment);
				!flag && form.setFieldValue("description", data.description);
			} else {
				flag && message.error(data);
			}
		}

		query();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.id]);

	return (
		<Modal
			title="更新会议室"
			open={props.isOpen}
			onOk={handleOk}
			onCancel={() => props.handleClose()}
			okText={"更新"}
		>
			<Form form={form} colon={false} {...layout}>
				<Form.Item
					label="会议室名称"
					name="name"
					rules={[{ required: true, message: "请输入会议室名称!" }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="位置"
					name="location"
					rules={[{ required: true, message: "请输入会议室位置!" }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="容纳人数"
					name="capacity"
					rules={[{ required: true, message: "请输入会议室容量!" }]}
				>
					<InputNumber />
				</Form.Item>
				<Form.Item label="设备" name="equipment">
					<Input />
				</Form.Item>
				<Form.Item label="描述" name="description">
					<TextArea />
				</Form.Item>
			</Form>
		</Modal>
	);
}
