## วิธีการติดตั้งและตั้งค่า Project

1. git clone แล้วเข้าโฟลเดอร์  
   `git clone https://github.com/cortex-s/AssetHub.git && cd AssetHub`

2. ติดตั้งโมดูลต่างๆด้วยคำสั่งต่อไปนี้ (รันทีเดียวจบ มันจะไล่ติดตั้งให้ทุกโฟลเดอร์เองครับ)
   `npm install`

3. ตั้งค่า environment หรือ ตั้งค่า key ต่างๆ
   - ก็อปจาก `.env.example` เป็น `.env`
   - กรอก `DATABASE_URL`, `JWT_SECRET` และอื่นๆ ต้องใส่ให้ครบครับ

4. การ migrate db / การสร้างโครงสร้างข้อมูลในฐานข้อมูล mysql  
   `npm run migrate` ได้เลยครับ แต่ก่อนรันต้องทำกรอกข้อมูลตามข้อ 3 ให้ครบก่อนครับ

5. การรัน frontend, backend
   - backend (ในโฟลเดอร์ api)
     `npm run dev` สำหรับการ development และหากต้องการรันแบบไม่ใช่ dev mode ก็ใช้ `npm run start`
   - frontend (ในโฟลเดอร์ www) `npm run dev` ควรรันแบบนี้เพราะมีผมมีการทำโฟลเดอร์ชื่อ shared ไว้แชร์ zod schema ระหว่าง frontend กับ backend
