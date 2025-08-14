from pathlib import Path

folder = Path(r"D:\snake\assets\choices")  # เปลี่ยนเป็นโฟลเดอร์ของคุณ

for p in folder.iterdir():  # ไม่ลงลึกโฟลเดอร์ย่อย; ถ้าต้องการแบบ recursive ใช้ rglob("**/*")
    if p.is_file() and p.suffix.lower() == ".jpg":
        new_path = p.with_suffix(".png")
        # กันเผื่อมีไฟล์ .png ชื่อซ้ำอยู่แล้ว
        if new_path.exists():
            print(f"ข้าม: {new_path.name} มีอยู่แล้ว")
            continue
        p.rename(new_path)
        print(f"เปลี่ยนชื่อ: {p.name} -> {new_path.name}")
