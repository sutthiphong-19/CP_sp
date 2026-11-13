"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BookOpen, Bookmark, Cctv,
  Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp, ClipboardCheck,
  Clock3, Copy, Cpu, FileText, Filter, Gauge, Lightbulb, Menu, Monitor, Network, Plug, Printer,
  Search, Sparkles, Star, Terminal, Trash2, Wrench, X,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Category = "Hardware" | "Windows & Software" | "Network" | "CCTV & Devices";
type Guide = {
  id: string;
  category: Category;
  title: string;
  summary: string;
  level: "พื้นฐาน" | "ปานกลาง";
};
type Section =
  | "Dashboard" | "Hardware" | "Windows & Software" | "Network" | "CCTV & Devices"
  | "Troubleshooting Guide" | "Commands & Tools" | "IT Support Simulator"
  | "Knowledge Quiz" | "My Learning";

const guides: Guide[] = [
  { id: "power-on", category: "Hardware", title: "คอมพิวเตอร์เปิดไม่ติด", summary: "ตรวจสอบอาการไม่มีไฟ พัดลมไม่หมุน หรือเปิดแล้วดับทันที", level: "พื้นฐาน" },
  { id: "no-display", category: "Hardware", title: "เปิดเครื่องติด แต่ไม่มีภาพ", summary: "ไล่ตรวจจอ สายสัญญาณ RAM และเสียง beep code", level: "พื้นฐาน" },
  { id: "black-screen", category: "Hardware", title: "หน้าจอเป็นสีดำ", summary: "แยกปัญหาระหว่างจอภาพ การ์ดจอ และ Windows", level: "พื้นฐาน" },
  { id: "bsod", category: "Hardware", title: "Blue Screen of Death (BSOD)", summary: "อ่าน stop code และหาสาเหตุจาก driver หรือ hardware", level: "ปานกลาง" },
  { id: "overheat", category: "Hardware", title: "คอมพิวเตอร์ร้อนเกินไป", summary: "ตรวจสอบอุณหภูมิ พัดลม ฝุ่น และการระบายอากาศ", level: "พื้นฐาน" },
  { id: "cpu-ram", category: "Hardware", title: "ปัญหา CPU และ RAM", summary: "วิเคราะห์เครื่องค้าง รีสตาร์ต หรือ memory error", level: "ปานกลาง" },
  { id: "disk", category: "Hardware", title: "ฮาร์ดดิสก์ / SSD มีปัญหา", summary: "สังเกต SMART warning เสียงผิดปกติ และดิสก์ไม่พบ", level: "ปานกลาง" },
  { id: "psu", category: "Hardware", title: "Power Supply ทำงานผิดปกติ", summary: "ตรวจอาการไฟไม่พอ เครื่องดับ หรือไม่ตอบสนอง", level: "ปานกลาง" },
  { id: "keyboard-mouse", category: "Hardware", title: "Keyboard และ Mouse ใช้งานไม่ได้", summary: "ทดสอบพอร์ต USB แบตเตอรี่ wireless และ driver", level: "พื้นฐาน" },
  { id: "monitor", category: "Hardware", title: "Monitor ไม่แสดงผล", summary: "เลือก input source ให้ถูกและทดสอบสายหรือจอสำรอง", level: "พื้นฐาน" },
  { id: "printer", category: "Hardware", title: "Printer พิมพ์งานไม่ได้", summary: "ตรวจ queue สถานะเครื่อง กระดาษ และการเชื่อมต่อ", level: "พื้นฐาน" },
  { id: "random-restart", category: "Hardware", title: "คอมพิวเตอร์ Restart เอง", summary: "ตรวจอุณหภูมิ ไฟเลี้ยง RAM และ system logs", level: "ปานกลาง" },
  { id: "windows-startup", category: "Windows & Software", title: "Windows Startup ไม่สำเร็จ", summary: "ใช้ Startup Repair และ Safe Mode อย่างเป็นขั้นตอน", level: "พื้นฐาน" },
  { id: "windows-install", category: "Windows & Software", title: "ติดตั้ง Windows ไม่สำเร็จ", summary: "ตรวจสื่อการติดตั้ง boot mode และพื้นที่ดิสก์", level: "ปานกลาง" },
  { id: "activation", category: "Windows & Software", title: "Windows Activation", summary: "ตรวจ edition, license และการเชื่อมต่อบัญชีองค์กร", level: "พื้นฐาน" },
  { id: "windows-update", category: "Windows & Software", title: "Windows Update Error", summary: "ตรวจพื้นที่ว่าง บริการ update และ error code", level: "พื้นฐาน" },
  { id: "slow-pc", category: "Windows & Software", title: "คอมพิวเตอร์ทำงานช้า", summary: "ใช้ Task Manager วิเคราะห์ CPU, memory และ startup apps", level: "พื้นฐาน" },
  { id: "app-freeze", category: "Windows & Software", title: "Application Not Responding", summary: "เก็บงานก่อนปิดโปรแกรม และตรวจ resource หรือ add-in", level: "พื้นฐาน" },
  { id: "install-error", category: "Windows & Software", title: "ติดตั้ง Software ไม่ได้", summary: "ตรวจสิทธิ์ รุ่นระบบ ไฟล์ติดตั้ง และพื้นที่ว่าง", level: "พื้นฐาน" },
  { id: "driver", category: "Windows & Software", title: "Driver มีปัญหา", summary: "ระบุอุปกรณ์จาก Device Manager และ rollback อย่างปลอดภัย", level: "ปานกลาง" },
  { id: "disk-space", category: "Windows & Software", title: "พื้นที่ Disk ไม่เพียงพอ", summary: "วิเคราะห์พื้นที่และเคลียร์ไฟล์โดยไม่ลบข้อมูลสำคัญ", level: "พื้นฐาน" },
  { id: "user-account", category: "Windows & Software", title: "ปัญหา User Account", summary: "ตรวจโปรไฟล์ สิทธิ์ผู้ใช้ และนโยบายบัญชีองค์กร", level: "ปานกลาง" },
  { id: "office", category: "Windows & Software", title: "Microsoft Office เปิดหรือใช้งานไม่ได้", summary: "ซ่อม Office ตรวจ license และปิด add-in ที่มีปัญหา", level: "พื้นฐาน" },
  { id: "security", category: "Windows & Software", title: "Antivirus และ Windows Security", summary: "ตรวจสถานะ protection และจัดการ alert อย่างปลอดภัย", level: "พื้นฐาน" },
  { id: "no-internet", category: "Network", title: "เชื่อมต่อ Internet ไม่ได้", summary: "แยกปัญหาอุปกรณ์ Wi-Fi, IP, gateway และ DNS", level: "พื้นฐาน" },
  { id: "wifi", category: "Network", title: "เชื่อมต่อ Wi-Fi ไม่ได้", summary: "ตรวจ airplane mode, SSID, credential และ access point", level: "พื้นฐาน" },
  { id: "lan", category: "Network", title: "LAN Connection มีปัญหา", summary: "ตรวจ link light, สาย LAN, switch port และ adapter", level: "พื้นฐาน" },
  { id: "limited", category: "Network", title: "Limited Connectivity", summary: "ตรวจ DHCP lease, IP configuration และ gateway", level: "พื้นฐาน" },
  { id: "ip-conflict", category: "Network", title: "IP Address Conflict", summary: "หาต้นเหตุ IP ซ้ำและคืนค่า DHCP อย่างถูกต้อง", level: "ปานกลาง" },
  { id: "dns", category: "Network", title: "DNS แก้ชื่อเว็บไซต์ไม่ได้", summary: "ใช้ nslookup แยกปัญหา DNS ออกจาก Internet", level: "พื้นฐาน" },
  { id: "dhcp", category: "Network", title: "DHCP แจก IP ไม่ได้", summary: "ตรวจ lease, scope, VLAN และ DHCP service", level: "ปานกลาง" },
  { id: "gateway", category: "Network", title: "Default Gateway ติดต่อไม่ได้", summary: "ตรวจ subnet, gateway address และเส้นทางเครือข่าย", level: "ปานกลาง" },
  { id: "slow-internet", category: "Network", title: "Internet ช้า", summary: "เปรียบเทียบ latency, bandwidth และจำนวนผู้ใช้งาน", level: "พื้นฐาน" },
  { id: "shared-folder", category: "Network", title: "เข้า Shared Folder ไม่ได้", summary: "ตรวจ network path, permission และชื่อบัญชี", level: "ปานกลาง" },
  { id: "network-printer", category: "Network", title: "เชื่อมต่อ Network Printer ไม่ได้", summary: "ตรวจ IP printer, queue และ print server", level: "ปานกลาง" },
  { id: "analog-ip", category: "CCTV & Devices", title: "CCTV Analog vs IP Camera", summary: "เปรียบเทียบสัญญาณ ระบบบันทึก สาย และการจ่ายไฟ", level: "พื้นฐาน" },
  { id: "dvr-nvr", category: "CCTV & Devices", title: "DVR และ NVR ต่างกันอย่างไร", summary: "เข้าใจเส้นทางสัญญาณและการเลือกเครื่องบันทึก", level: "พื้นฐาน" },
  { id: "camera-offline", category: "CCTV & Devices", title: "Camera แสดงสถานะ Offline", summary: "ตรวจ PoE, link, IP address และสถานะกล้อง", level: "พื้นฐาน" },
  { id: "no-video", category: "CCTV & Devices", title: "CCTV ไม่มี Video Signal", summary: "ตรวจแหล่งจ่ายไฟ สายสัญญาณ input และ channel", level: "พื้นฐาน" },
  { id: "remote-cctv", category: "CCTV & Devices", title: "ดู CCTV จากภายนอกไม่ได้", summary: "ตรวจสิทธิ์ เครือข่าย และการตั้งค่า remote access", level: "ปานกลาง" },
  { id: "ip-camera", category: "CCTV & Devices", title: "เชื่อมต่อ Network Camera", summary: "ตรวจ subnet, IP conflict และการเข้าถึงหน้าอุปกรณ์", level: "ปานกลาง" },
  { id: "poe", category: "CCTV & Devices", title: "PoE Switch จ่ายไฟไม่พอ", summary: "คำนวณ power budget และตรวจมาตรฐาน PoE", level: "ปานกลาง" },
  { id: "rj45", category: "CCTV & Devices", title: "เข้าหัว RJ45 และทดสอบสาย", summary: "รู้จัก T568A/B และตรวจสายด้วย cable tester", level: "พื้นฐาน" },
  { id: "cable", category: "CCTV & Devices", title: "ทดสอบสาย LAN", summary: "หาสายขาด คู่สายสลับ และหัวต่อที่หลวม", level: "พื้นฐาน" },
  { id: "printer-install", category: "CCTV & Devices", title: "ติดตั้ง Printer และ Scanner", summary: "ติดตั้ง driver เชื่อมต่ออุปกรณ์และทดสอบงาน", level: "พื้นฐาน" },
  { id: "shared-printer", category: "CCTV & Devices", title: "แก้ปัญหา Shared Printer", summary: "ตรวจ print server, driver และสิทธิ์ผู้ใช้", level: "ปานกลาง" }
];

const categories: { title: Category; desc: string; icon: LucideIcon; color: string; bg: string }[] = [
  { title: "Hardware", desc: "อุปกรณ์คอมพิวเตอร์และการวิเคราะห์อาการ", icon: Cpu, color: "#3268f5", bg: "#edf3ff" },
  { title: "Windows & Software", desc: "Windows, โปรแกรม และเครื่องมือระบบ", icon: Monitor, color: "#8a5ae8", bg: "#f4efff" },
  { title: "Network", desc: "พื้นฐานเครือข่ายและคำสั่งวิเคราะห์", icon: Network, color: "#169b83", bg: "#eaf8f5" },
  { title: "CCTV & Devices", desc: "กล้องวงจรปิด เครื่องพิมพ์ และอุปกรณ์ต่อพ่วง", icon: Cctv, color: "#de8c31", bg: "#fff5e9" }
];

const navItems: { title: Section; icon: LucideIcon; group: "learn" | "tools" }[] = [
  { title: "Dashboard", icon: Gauge, group: "learn" },
  { title: "Hardware", icon: Cpu, group: "learn" },
  { title: "Windows & Software", icon: Monitor, group: "learn" },
  { title: "Network", icon: Network, group: "learn" },
  { title: "CCTV & Devices", icon: Plug, group: "learn" },
  { title: "Troubleshooting Guide", icon: ClipboardCheck, group: "learn" },
  { title: "Commands & Tools", icon: Terminal, group: "tools" },
  { title: "IT Support Simulator", icon: Activity, group: "tools" },
  { title: "Knowledge Quiz", icon: CircleHelp, group: "tools" },
  { title: "My Learning", icon: Bookmark, group: "tools" }
];

const commands = [
  { name: "ipconfig", group: "Network Commands", syntax: "ipconfig", purpose: "ดู IP configuration แบบย่อของ network adapters", example: "ipconfig", output: "แสดง IPv4 Address, Subnet Mask และ Default Gateway ของ adapter ที่เชื่อมต่อ", scenario: "ใช้ตรวจเบื้องต้นว่าเครื่องได้รับ IP และ gateway แล้วหรือไม่" },
  { name: "ipconfig /all", group: "Network Commands", syntax: "ipconfig /all", purpose: "แสดงรายละเอียด adapter, DNS, DHCP และ MAC address", example: "ipconfig /all", output: "แสดง DHCP Enabled, DNS Servers, Lease และ Physical Address", scenario: "ใช้เก็บรายละเอียดก่อนส่งเคส DHCP, DNS หรือ IP conflict" },
  { name: "ipconfig /release", group: "Network Commands", syntax: "ipconfig /release", purpose: "คืน IPv4 lease ปัจจุบันของ adapter ที่ใช้ DHCP", example: "ipconfig /release", output: "IPv4 address ของ adapter จะถูกปล่อยชั่วคราวจนกว่าจะ renew", scenario: "ใช้คู่กับ /renew เมื่อได้รับ IP ผิดปกติ; แจ้งผู้ใช้ก่อนเพราะเครือข่ายจะหลุดชั่วคราว" },
  { name: "ipconfig /renew", group: "Network Commands", syntax: "ipconfig /renew", purpose: "ขอ IPv4 lease ใหม่จาก DHCP server", example: "ipconfig /renew", output: "แสดงผลการขอ lease ใหม่ของ adapter", scenario: "ใช้หลังตรวจ DHCP หรือ release เมื่อเครื่องไม่ได้รับ IP ที่ใช้งานได้" },
  { name: "ipconfig /flushdns", group: "Network Commands", syntax: "ipconfig /flushdns", purpose: "ล้าง DNS resolver cache ในเครื่อง", example: "ipconfig /flushdns", output: "Successfully flushed the DNS Resolver Cache.", scenario: "ใช้เมื่อ DNS cache เก่าทำให้ resolve ไปยัง IP เดิม; ไม่ได้แก้ DNS server ล่ม" },
  { name: "ping", group: "Network Commands", syntax: "ping <host>", purpose: "ทดสอบการตอบกลับและ latency ไปยัง host", example: "ping 8.8.8.8", output: "Reply from ... time=...ms หรือ Request timed out", scenario: "ทดสอบ gateway, IP ปลายทาง หรือแยกปัญหา DNS โดยลอง ping IP เทียบกับ hostname" },
  { name: "tracert", group: "Network Commands", syntax: "tracert <host>", purpose: "แสดง hop ที่ packet เดินทางไปยังปลายทาง", example: "tracert example.com", output: "รายการ hop และ response time; * อาจหมายถึง router ไม่ตอบ ICMP", scenario: "ใช้ตรวจเส้นทางเมื่อบางปลายทางเข้าไม่ได้; hop ที่ timeout ไม่ได้ยืนยันว่าเส้นทางเสียเสมอ" },
  { name: "nslookup", group: "Network Commands", syntax: "nslookup <hostname>", purpose: "สอบถาม DNS เพื่อแปลงชื่อ host เป็น IP", example: "nslookup example.com", output: "แสดง DNS server ที่ตอบและ Address ที่ resolve ได้", scenario: "ใช้แยกปัญหา DNS: ถ้า ping IP ได้แต่ resolve ชื่อไม่ได้ ให้ตรวจ DNS" },
  { name: "sfc /scannow", group: "Windows CMD Commands", syntax: "sfc /scannow", purpose: "ตรวจและซ่อมไฟล์ระบบ Windows ที่เสียหาย", example: "sfc /scannow", output: "Windows Resource Protection รายงานผลการสแกนและการซ่อม", scenario: "ใช้เมื่อพบอาการระบบผิดปกติ; เปิด Command Prompt แบบ Administrator และขออนุมัติตามนโยบาย" },
  { name: "Get-NetAdapter", group: "PowerShell Commands", syntax: "Get-NetAdapter", purpose: "แสดงสถานะและ link speed ของ network adapters", example: "Get-NetAdapter | Format-Table Name, Status, LinkSpeed", output: "ตาราง adapter พร้อมสถานะ Up/Disconnected และ LinkSpeed", scenario: "ใช้ตรวจว่า Windows มองเห็น adapter และ link ขึ้นหรือไม่" },
  { name: "Task Manager", group: "Windows Administrative Tools", syntax: "Ctrl + Shift + Esc", purpose: "ดู process และการใช้ CPU, Memory, Disk และ Network", example: "เปิดแท็บ Processes แล้วเรียงตาม CPU", output: "รายการโปรเซสและเปอร์เซ็นต์ทรัพยากรแบบ real-time", scenario: "เริ่มวิเคราะห์เครื่องช้าก่อนปิดโปรแกรม; อย่า End task งานที่ผู้ใช้ยังไม่ได้บันทึก" },
  { name: "Device Manager", group: "Windows Administrative Tools", syntax: "devmgmt.msc", purpose: "ตรวจอุปกรณ์ driver และสถานะอุปกรณ์", example: "กด Win + R พิมพ์ devmgmt.msc", output: "รายการอุปกรณ์; เครื่องหมายเตือนสีเหลืองบ่งชี้ปัญหาที่ควรตรวจ", scenario: "ใช้ค้นหา driver issue; สร้าง restore point หรือบันทึก driver เดิมก่อนเปลี่ยน" },
  { name: "Event Viewer", group: "Windows Administrative Tools", syntax: "eventvwr.msc", purpose: "ตรวจ system และ application logs ตามเวลาเกิดเหตุ", example: "Windows Logs > System > Filter Current Log", output: "รายการ event พร้อม level, source, Event ID และ timestamp", scenario: "ใช้เทียบ Error/Warning กับเวลาที่ผู้ใช้รายงาน; Event ID ต้องดูบริบทประกอบ" },
  { name: "Disk Management", group: "Windows Administrative Tools", syntax: "diskmgmt.msc", purpose: "ตรวจ disk, partition, drive letter และสถานะ volume", example: "กด Win + R พิมพ์ diskmgmt.msc", output: "แผนผัง disk และสถานะ partition", scenario: "ตรวจ drive หายหรือไม่มี letter; ห้าม initialize, format หรือ resize โดยไม่สำรองข้อมูลและได้รับอนุมัติ" },
  { name: "Windows Settings", group: "Windows Administrative Tools", syntax: "Win + I", purpose: "จัดการ Network, Update, Accounts และ System settings", example: "Settings > Network & internet > Advanced network settings", output: "หน้าตั้งค่าที่เกี่ยวข้องกับ Windows", scenario: "ใช้ตรวจค่าเบื้องต้นตามนโยบายองค์กร; จดค่าเดิมก่อนแก้ configuration" },
  { name: "Services", group: "Windows Administrative Tools", syntax: "services.msc", purpose: "ตรวจสถานะและ startup type ของ Windows services", example: "เปิด services.msc แล้วตรวจ Windows Update", output: "รายการ service พร้อมสถานะ Running/Stopped", scenario: "ใช้ตรวจ service ที่เกี่ยวข้อง; อย่าหยุดหรือเปลี่ยน startup type โดยไม่มี change approval" }
];

const scenarios = [
  {
    title: "ผู้ใช้เชื่อมต่อ Internet ไม่ได้",
    story: "พนักงานแจ้งว่าเข้าเว็บไซต์ไม่ได้ แต่เพื่อนร่วมทีมบน Wi-Fi เดียวกันใช้งานได้ อาการเริ่มหลังย้ายโต๊ะเมื่อเช้านี้",
    options: ["ตรวจ IP, Default Gateway และ link ของเครื่องก่อน", "รีเซ็ต Router ทั้งสำนักงานทันที", "ติดตั้ง Windows ใหม่"],
    correct: 0,
    feedback: "เริ่มจาก scope ที่เล็กที่สุด: ตรวจสายหรือ Wi-Fi, ipconfig และ ping gateway ก่อน หาก IP เป็น 169.254.x.x ให้สงสัย DHCP; ถ้า gateway ตอบแต่เว็บไม่ได้ค่อยตรวจ DNS."
  },
  {
    title: "เปิดเครื่องแล้วจอไม่แสดงภาพ",
    story: "ไฟเครื่องติดและพัดลมหมุน แต่จอขึ้น No Signal ผู้ใช้เพิ่งย้ายคอมพิวเตอร์ไปอีกโต๊ะ",
    options: ["เช็กไฟจอและเลือก input ให้ตรง จากนั้นเสียบสายให้แน่น", "ถอด CPU แล้วใส่ใหม่ทันที", "ลง Windows ใหม่จาก USB"],
    correct: 0,
    feedback: "ตรวจเรื่องง่ายและไม่เสี่ยงก่อน: ไฟจอ, input source, สาย HDMI/DP และพอร์ตที่ถูกต้อง จากนั้นลองจอหรือสายที่ทราบว่าใช้งานได้ ก่อนเปิดเคสตรวจ RAM."
  },
  {
    title: "Printer ไม่พิมพ์เอกสาร",
    story: "ผู้ใช้ส่งเอกสารไปพิมพ์แล้วไม่มีงานออกมา เพื่อนอีกคนยังพิมพ์จากเครื่องเดียวกันได้",
    options: ["ตรวจว่าเลือก printer ถูกตัวและดู print queue ของผู้ใช้นี้", "ลบ driver ของทุกคนบน print server", "ปิด Windows Firewall"],
    correct: 0,
    feedback: "เมื่อมีผู้ใช้คนอื่นพิมพ์ได้ ปัญหาน่าจะเฉพาะเครื่องหรือ queue ของผู้ใช้ ตรวจ default printer, paused/offline job, queue และการเชื่อมต่อ ก่อนแก้ driver."
  },
  {
    title: "เข้า Shared Folder ไม่ได้",
    story: "ผู้ใช้เห็นข้อความ Access denied เมื่อเปิด \\\\fileserver\\team แต่เมื่อวานยังเปิดได้",
    options: ["ยืนยันบัญชีและสิทธิ์ที่ได้รับ พร้อมตรวจว่าผู้ใช้คนอื่นเข้าได้หรือไม่", "ให้ใช้บัญชีของเพื่อนร่วมงานแทน", "ปิดการยืนยันตัวตนของ file server"],
    correct: 0,
    feedback: "ห้ามแชร์รหัสผ่านหรือข้ามสิทธิ์ ตรวจว่าเป็นปัญหาเฉพาะผู้ใช้หรือทั้ง share, ยืนยัน account/group membership และส่งคำขอแก้ permission ให้เจ้าของข้อมูลอนุมัติ."
  },
  {
    title: "คอมพิวเตอร์ทำงานช้าผิดปกติ",
    story: "เครื่องใช้เวลานานในการเปิดโปรแกรม ผู้ใช้กำลังทำงานเอกสารที่ยังไม่ได้บันทึก",
    options: ["ถามก่อนปิดงาน แล้วดู Task Manager เพื่อหาทรัพยากรที่เต็ม", "End task ทุก process ที่ใช้ CPU", "ลบไฟล์ในโฟลเดอร์ Windows"],
    correct: 0,
    feedback: "ปกป้องงานผู้ใช้ก่อน ดู CPU, Memory, Disk และ process ที่ใช้สูงอย่างต่อเนื่อง จดข้อมูลและเวลาที่พบ จากนั้นตรวจ startup, พื้นที่ดิสก์ และ malware alert ตามขั้นตอน."
  }
];

const quizQuestions = [
  { q: "คำสั่งใดใช้ดูรายละเอียด IP, DHCP และ DNS ของ network adapter?", options: ["ping /all", "ipconfig /all", "nslookup /all", "tracert /all"], answer: 1, why: "ipconfig /all แสดงค่า adapter รวมถึง IPv4, DHCP, DNS server และ MAC address" },
  { q: "เมื่อจอขึ้น No Signal สิ่งใดควรตรวจเป็นอันดับแรก?", options: ["ติดตั้ง Windows ใหม่", "เลือก input source และตรวจสายจอ", "เปลี่ยนเมนบอร์ด", "ล้าง DNS cache"], answer: 1, why: "เริ่มจาก input source และสาย/พอร์ตที่ไม่ต้องแกะเครื่อง ก่อนวิเคราะห์อุปกรณ์ภายใน" },
  { q: "ping gateway สำเร็จ แต่ ping ชื่อเว็บไซต์ไม่ได้ อาจชี้ไปที่ปัญหาใด?", options: ["DNS", "จอภาพ", "RAM", "Printer queue"], answer: 0, why: "ถ้าเชื่อมต่อ IP gateway ได้ แต่ resolve หรือ ping hostname ไม่ได้ ควรตรวจ DNS ด้วย nslookup" },
  { q: "ก่อน initialize หรือ format ดิสก์ที่ไม่รู้จัก ควรทำอะไร?", options: ["ทำทันทีเพื่อให้ Windows เห็นดิสก์", "ขออนุมัติและยืนยัน backup/ข้อมูลก่อน", "เปลี่ยน drive letter", "รัน ipconfig /renew"], answer: 1, why: "การ initialize/format อาจทำให้เข้าถึงข้อมูลเดิมไม่ได้ ต้องยืนยันเจ้าของข้อมูล สำรอง และ authorization ก่อน" },
  { q: "เหตุใดจึงไม่ควรแชร์บัญชีของเพื่อนเพื่อเข้า Shared Folder?", options: ["ทำให้ DNS ช้าลง", "ลดความสามารถในการตรวจสอบตัวตนและละเมิดสิทธิ์", "ทำให้ printer offline", "ไม่มีเหตุผล"], answer: 1, why: "ใช้บัญชีเฉพาะบุคคลและสิทธิ์ที่อนุมัติเพื่อรักษาความปลอดภัยและ audit trail" }
];

const pageDescriptions: Record<Section, string> = {
  Dashboard: "ศูนย์รวมบทเรียนและเครื่องมือสำหรับงาน IT Support ที่ใช้ได้จริง",
  Hardware: "วิเคราะห์อุปกรณ์คอมพิวเตอร์ พร้อมแนวทางตรวจเช็กอย่างปลอดภัย",
  "Windows & Software": "แก้ปัญหา Windows และซอฟต์แวร์ด้วยเครื่องมือที่มีในระบบ",
  Network: "ไล่ตรวจปัญหาเครือข่ายจากเครื่องผู้ใช้ไปจนถึงบริการปลายทาง",
  "CCTV & Devices": "เรียนรู้ CCTV, printer และอุปกรณ์ต่อพ่วงในสภาพแวดล้อมจริง",
  "Troubleshooting Guide": "ขั้นตอนคิดและแก้ปัญหาอย่างเป็นระบบ พร้อมจุดที่ควร escalate",
  "Commands & Tools": "คลังคำสั่งและเครื่องมือวินิจฉัยสำหรับงาน IT Support",
  "IT Support Simulator": "ฝึกตัดสินใจจากเหตุการณ์จำลองที่พบได้ในงานประจำวัน",
  "Knowledge Quiz": "ทบทวนความเข้าใจผ่านคำถามพร้อมเฉลยและคำอธิบาย",
  "My Learning": "จัดการบทเรียนที่บันทึกไว้ ความคืบหน้า และบันทึกส่วนตัว"
};

function lessonDetails(guide: Guide) {
  const isNetwork = guide.category === "Network";
  const isSoftware = guide.category === "Windows & Software";
  const isCctv = guide.category === "CCTV & Devices";
  const symptoms = isNetwork
    ? "เข้าใช้งานเครือข่ายหรือบริการปลายทางไม่ได้ บางครั้งเกิดเฉพาะเครื่องหรือบางช่วงเวลา"
    : isSoftware
      ? "Windows หรือโปรแกรมแสดง error ทำงานช้า หรือไม่ทำงานตามปกติ"
      : isCctv
        ? "อุปกรณ์ไม่ออนไลน์ ไม่มีภาพ หรือผู้ใช้ไม่สามารถใช้งานอุปกรณ์ที่เชื่อมต่อได้"
        : "อุปกรณ์ทำงานผิดปกติ แสดงอาการเป็นช่วง ๆ หรือไม่ตอบสนองต่อการใช้งาน";
  const causes = isNetwork
    ? ["สาย / Wi-Fi / adapter หรือ switch port มีปัญหา", "IP, DHCP, gateway หรือ DNS ตั้งค่าไม่ถูกต้อง", "สิทธิ์หรือบริการปลายทางเปลี่ยนแปลง"]
    : isSoftware
      ? ["การตั้งค่า, update หรือ driver เปลี่ยนไป", "ทรัพยากรเครื่องหรือพื้นที่ดิสก์ไม่เพียงพอ", "สิทธิ์ผู้ใช้หรือไฟล์โปรแกรมเสียหาย"]
      : isCctv
        ? ["แหล่งจ่ายไฟ, PoE budget หรือสายเชื่อมต่อผิดปกติ", "IP/subnet, channel หรือ network path ไม่ตรงกัน", "อุปกรณ์, firmware หรือสิทธิ์การเข้าถึงมีปัญหา"]
        : ["การเชื่อมต่อหรือไฟเลี้ยงไม่แน่น", "อุปกรณ์สึกหรอ ร้อน หรือ driver ไม่เข้ากัน", "การเปลี่ยนแปลงล่าสุดทำให้อุปกรณ์ทำงานผิดปกติ"];
  const steps = isNetwork
    ? ["ยืนยันขอบเขต: เครื่องเดียว, ผู้ใช้เดียว หรือทั้งพื้นที่ พร้อมเวลาที่เริ่มมีอาการ", "ตรวจ link / Wi-Fi และใช้ ipconfig /all เพื่อดู IP, gateway, DHCP และ DNS", "ทดสอบ ping ไปยัง gateway แล้วทดสอบปลายทาง; ใช้ nslookup เมื่อสงสัย DNS", "แก้เฉพาะค่าที่มีหลักฐานรองรับ และทดสอบซ้ำกับผู้ใช้"]
    : isSoftware
      ? ["บันทึกข้อความ error และยืนยันว่าเกิดกับผู้ใช้หรือเครื่องใด", "ตรวจพื้นที่ว่าง, Task Manager และ Event Viewer ในช่วงเวลาที่เกิดเหตุ", "ทดลองวิธีที่ย้อนกลับได้ก่อน เช่น restart โปรแกรมหรือ repair", "ก่อน update, uninstall หรือเปลี่ยน driver ให้สำรอง/จดค่าเดิมและขออนุมัติ"]
      : isCctv
        ? ["ยืนยันอาการและบันทึกชื่ออุปกรณ์, channel, เวลา และผู้ใช้ที่ได้รับผลกระทบ", "ตรวจไฟ, สาย, link light, PoE budget และสถานะพอร์ต", "ตรวจ IP/subnet, NVR/DVR channel และสิทธิ์เข้าถึงตามที่ได้รับอนุญาต", "ทดสอบภาพ/การเชื่อมต่อหลังแก้ พร้อมยืนยันกับผู้ใช้งาน"]
        : ["ถามอาการที่พบและการเปลี่ยนแปลงล่าสุด พร้อมบันทึกข้อความหรือไฟสถานะ", "ตรวจไฟ สาย พอร์ต และอุปกรณ์ภายนอก โดยยังไม่แกะเครื่อง", "ทดสอบด้วยสาย/อุปกรณ์ที่ทราบว่าใช้งานได้ ทีละจุดเพื่อแยกสาเหตุ", "หากต้องเปิดเคส ตรวจอะไหล่ หรือถอดชิ้นส่วน ให้ทำตามนโยบายและขออนุญาตก่อน"];
  return { symptoms, causes, steps, isNetwork, isSoftware, isCctv };
}

export default function Home() {
  const [section, setSection] = useState<Section>("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ทั้งหมด");
  const [levelFilter, setLevelFilter] = useState("ทุกระดับ");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [notes, setNotes] = useState<{ id: number; text: string }[]>([]);
  const [newNote, setNewNote] = useState("");
  const [toast, setToast] = useState("");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [commandFilter, setCommandFilter] = useState("ทั้งหมด");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("fixlab-learning-v1");
      if (saved) {
        const data = JSON.parse(saved) as { bookmarks?: string[]; completed?: string[]; recent?: string[]; notes?: { id: number; text: string }[] };
        setBookmarks(data.bookmarks ?? []);
        setCompleted(data.completed ?? []);
        setRecent(data.recent ?? []);
        setNotes(data.notes ?? []);
      }
    } catch (error) {
      console.error("Unable to load saved learning progress", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("fixlab-learning-v1", JSON.stringify({ bookmarks, completed, recent, notes }));
    } catch (error) {
      console.error("Unable to save learning progress", error);
    }
  }, [bookmarks, completed, recent, notes]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleGuides = useMemo(() => {
    const sectionCategory = categories.find((item) => item.title === section)?.title;
    return guides.filter((guide) => {
      const categoryMatches = section === "Troubleshooting Guide" || !sectionCategory || guide.category === sectionCategory;
      const filterMatches = categoryFilter === "ทั้งหมด" || guide.category === categoryFilter;
      const levelMatches = levelFilter === "ทุกระดับ" || guide.level === levelFilter;
      const textMatches = !query || `${guide.title} ${guide.summary} ${guide.category}`.toLowerCase().includes(query.toLowerCase());
      return categoryMatches && filterMatches && levelMatches && textMatches;
    });
  }, [section, categoryFilter, levelFilter, query]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return guides.filter((guide) => `${guide.title} ${guide.summary} ${guide.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }, [query]);

  const openGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    setRecent((previous) => [guide.id, ...previous.filter((id) => id !== guide.id)].slice(0, 5));
    setQuery("");
  };

  const navigate = (next: Section) => {
    setSection(next);
    setSelectedGuide(null);
    setSidebarOpen(false);
    setCategoryFilter("ทั้งหมด");
    setLevelFilter("ทุกระดับ");
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [id, ...previous]);
    setToast(bookmarks.includes(id) ? "นำออกจากรายการบันทึกแล้ว" : "บันทึกบทเรียนแล้ว");
  };

  const completeGuide = (id: string) => {
    setCompleted((previous) => previous.includes(id) ? previous : [...previous, id]);
    setToast("บันทึกความคืบหน้าบทเรียนแล้ว");
  };

  const copyCommand = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast("คัดลอกคำสั่งแล้ว");
    } catch {
      setToast("คัดลอกไม่ได้ — กรุณาเลือกและคัดลอกคำสั่งด้วยตนเอง");
    }
  };

  const addNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = newNote.trim();
    if (!text) return;
    setNotes((previous) => [{ id: Date.now(), text }, ...previous]);
    setNewNote("");
    setToast("เพิ่มบันทึกแล้ว");
  };

  const activeScenario = scenarios[scenarioIndex];
  const activeQuiz = quizQuestions[quizIndex];
  const filteredCommands = commands.filter((command) => commandFilter === "ทั้งหมด" || command.group === commandFilter);
  const learningPercent = Math.round(completed.length / guides.length * 100);
  const sectionName = section === "Dashboard" ? "ภาพรวม" : section;

  const renderGuideGrid = () => (
    <>
      <div className="list-controls">
        <label className="flex items-center gap-2 text-[10px] text-slate-400"><Filter size={13} />
          <select className="filter-select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option>ทั้งหมด</option>{categories.map((category) => <option key={category.title}>{category.title}</option>)}
          </select>
        </label>
        <select className="filter-select" aria-label="ระดับความยาก" value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)}>
          <option>ทุกระดับ</option><option>พื้นฐาน</option><option>ปานกลาง</option>
        </select>
        <span className="results-count">แสดง {visibleGuides.length} จาก {guides.length} บทเรียน</span>
      </div>
      <div className="topic-grid">
        {visibleGuides.length ? visibleGuides.map((guide) => {
          const category = categories.find((item) => item.title === guide.category)!;
          const Icon = category.icon;
          return (
            <motion.button layout key={guide.id} className="topic-card" onClick={() => openGuide(guide)}>
              <div className="topic-card-top">
                <span className="category-icon" style={{ color: category.color, background: category.bg }}><Icon size={17} /></span>
                {completed.includes(guide.id) && <span className="completed-badge"><CheckCircle2 size={12} /> เรียนแล้ว</span>}
              </div>
              <h4>{guide.title}</h4>
              <p>{guide.summary}</p>
              <div className="topic-card-foot"><span className="tag">{guide.level}</span><span className="duration">ประมาณ 5 นาที <ChevronRight size={12} className="inline" /></span></div>
            </motion.button>
          );
        }) : <div className="empty-state">ไม่พบบทเรียนที่ตรงกับคำค้นหาหรือตัวกรองนี้</div>}
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Zap size={19} fill="currentColor" /></div>
          <div><div className="brand-name">fixlab<span className="text-blue-600">.</span></div><div className="brand-sub">IT Support Academy</div></div>
          <button className="ml-auto grid h-7 w-7 place-items-center rounded-lg border-0 bg-transparent text-slate-400 md:hidden" onClick={() => setSidebarOpen(false)} aria-label="ปิดเมนู"><X size={16} /></button>
        </div>
        <div className="nav-caption">Learning</div>
        <nav className="nav-list" aria-label="เมนูการเรียนรู้">
          {navItems.filter((item) => item.group === "learn").map((item) => {
            const Icon = item.icon;
            return <button key={item.title} onClick={() => navigate(item.title)} className={`nav-link ${section === item.title ? "active" : ""}`}><Icon size={16} strokeWidth={1.8} />{item.title}</button>;
          })}
        </nav>
        <div className="nav-caption mt-4">Practice & Tools</div>
        <nav className="nav-list" aria-label="เมนูเครื่องมือ">
          {navItems.filter((item) => item.group === "tools").map((item) => {
            const Icon = item.icon;
            return <button key={item.title} onClick={() => navigate(item.title)} className={`nav-link ${section === item.title ? "active" : ""}`}><Icon size={16} strokeWidth={1.8} />{item.title}</button>;
          })}
        </nav>
        <div className="side-footer">
          <div className="help-card">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700"><CircleHelp size={13} className="text-blue-500" /> เริ่มต้นใช้งาน</span>
            <p>ฝึกคิดเป็นขั้นตอนและจดบันทึกทุกเคสให้ตรวจสอบย้อนหลังได้</p>
            <button className="help-link" onClick={() => navigate("Troubleshooting Guide")}>ดูคู่มือแก้ปัญหา <ArrowRight size={12} /></button>
          </div>
          <div className="profile"><div className="avatar">IT</div><div><div className="profile-name">IT Support Learner</div><div className="profile-role">สมาชิกผู้เรียน</div></div><ChevronDown size={14} className="ml-auto text-slate-400" /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="เปิดเมนู"><Menu size={17} /></button>
          <div className="crumbs">Workspace <ChevronRight size={12} className="mx-1 inline" /> <strong>{sectionName}</strong></div>
          <div className="top-actions">
            <div className="search-wrap">
              <Search size={14} className="search-icon" />
              <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาบทเรียนหรือคำสั่ง..." aria-label="ค้นหาบทเรียนหรือคำสั่ง" />
              {query && <div className="absolute right-0 top-11 z-30 w-[min(360px,85vw)] overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
                <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">บทเรียนที่พบ</div>
                {searchResults.length ? searchResults.map((guide) => <button key={guide.id} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] text-slate-600 hover:bg-slate-50" onClick={() => { navigate(guide.category); openGuide(guide); }}><BookOpen size={13} className="text-blue-500" /><span className="flex-1">{guide.title}</span><span className="text-[9px] text-slate-400">{guide.category}</span></button>) : <div className="px-2 py-3 text-[10px] text-slate-400">ไม่พบบทเรียนที่ตรงกัน</div>}
                {commands.filter((item) => `${item.name} ${item.purpose}`.toLowerCase().includes(query.toLowerCase())).slice(0, 2).map((command) => <button key={command.name} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] text-slate-600 hover:bg-slate-50" onClick={() => { navigate("Commands & Tools"); setQuery(""); }}><Terminal size={13} className="text-emerald-500" /><span className="font-mono">{command.name}</span><span className="truncate text-slate-400">{command.purpose}</span></button>)}
              </div>}
            </div>
            <button className="icon-button" aria-label="การแจ้งเตือน" onClick={() => setToast("ไม่มีการแจ้งเตือนใหม่")}><Activity size={15} /></button>
          </div>
        </header>

        <div className="content">
          {section === "Dashboard" && <>
            <div className="flex items-end justify-between gap-3">
              <div><div className="eyebrow">วันเสาร์ที่ 14 พฤศจิกายน 2026</div><h1 className="page-title">สวัสดี, IT Support Learner 👋</h1><p className="page-subtitle">พร้อมเรียนรู้และแก้ปัญหาอย่างมั่นใจหรือยัง?</p></div>
              <span className="hidden items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-3 py-2 text-[10px] text-slate-500 sm:flex"><Sparkles size={13} className="text-amber-400" /> เรียนรู้ได้ทุกวัน</span>
            </div>
            <motion.section className="hero" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
              <div className="hero-content">
                <div className="hero-kicker">IT SUPPORT LEARNING CENTER</div>
                <h2>แก้ปัญหาเป็นระบบ<br />เริ่มต้นที่ Fixlab</h2>
                <p>เรียนรู้วิธีวิเคราะห์ปัญหาคอมพิวเตอร์จากอาการจริง พร้อมขั้นตอนที่ปลอดภัยและนำไปใช้ในงาน IT Support ได้ทันที</p>
                <button className="hero-cta" onClick={() => navigate("Troubleshooting Guide")}>เริ่มเรียนรู้ <ArrowRight size={14} /></button>
              </div>
              <div className="workstation" aria-hidden="true"><div className="monitor"><div className="screen-ui" /></div><div className="monitor-stand" /><div className="desk" /><div className="keyboard" /><div className="mouse" /><div className="plant" /></div>
            </motion.section>
            <div className="stat-grid">
              {[
                { label: "บทเรียนทั้งหมด", value: guides.length, hint: "ครอบคลุม 4 หมวดหมู่", icon: BookOpen, color: "#3268f5", bg: "#edf3ff" },
                { label: "เรียนจบแล้ว", value: completed.length, hint: completed.length ? `คิดเป็น ${learningPercent}% ของบทเรียน` : "เริ่มเรียนเพื่อบันทึกความคืบหน้า", icon: CheckCircle2, color: "#19a36f", bg: "#eaf8f2" },
                { label: "บันทึกไว้", value: bookmarks.length, hint: "บทเรียนที่อยากกลับมาทบทวน", icon: Bookmark, color: "#9865df", bg: "#f4efff" },
                { label: "คำสั่งและเครื่องมือ", value: commands.length, hint: "พร้อมตัวอย่างและวิธีใช้งาน", icon: Terminal, color: "#df9237", bg: "#fff5e9" }
              ].map((stat) => {
                const Icon = stat.icon;
                return <div key={stat.label} className="stat-card"><div className="stat-icon" style={{ color: stat.color, background: stat.bg }}><Icon size={18} /></div><div><div className="stat-label">{stat.label}</div><div className="stat-value">{stat.value}</div><div className="stat-hint">{stat.hint}</div></div></div>;
              })}
            </div>
            <div className="section-heading"><div><h3>สำรวจหมวดหมู่</h3><p>เลือกหัวข้อเพื่อเริ่มต้นแก้ปัญหา</p></div><button className="text-button" onClick={() => navigate("Troubleshooting Guide")}>ดูบทเรียนทั้งหมด <ArrowRight size={13} /></button></div>
            <div className="category-grid">
              {categories.map((category) => {
                const Icon = category.icon;
                return <button key={category.title} className="category-card" onClick={() => navigate(category.title)}><div className="category-top"><span className="category-icon" style={{ color: category.color, background: category.bg }}><Icon size={18} /></span><span className="category-count">{guides.filter((guide) => guide.category === category.title).length} บทเรียน <ArrowRight size={11} className="ml-1 inline" /></span></div><h4>{category.title}</h4><p>{category.desc}</p></button>;
              })}
            </div>
            <div className="section-heading"><div><h3>เรียนรู้ต่อ</h3><p>บทเรียนที่เปิดดูล่าสุด</p></div><button className="text-button" onClick={() => navigate("My Learning")}>ความคืบหน้าของฉัน <ArrowRight size={13} /></button></div>
            <div className="lower-grid">
              <div className="panel"><div className="panel-title"><h3>หัวข้อที่ดูล่าสุด</h3><span>{recent.length} รายการ</span></div><div className="topic-list">{(recent.length ? recent : ["no-internet", "slow-pc", "no-display"].map((id) => id)).map((id) => {
                const guide = guides.find((item) => item.id === id);
                if (!guide) return null;
                const category = categories.find((item) => item.title === guide.category)!;
                const Icon = category.icon;
                return <div className="topic-row" key={guide.id}><span className="topic-mini-icon" style={{ color: category.color, background: category.bg }}><Icon size={15} /></span><div className="topic-main"><strong>{guide.title}</strong><span>{guide.category} · {completed.includes(guide.id) ? "เรียนจบแล้ว" : "ประมาณ 5 นาที"}</span></div><button className="row-arrow" onClick={() => openGuide(guide)} aria-label={`เปิด ${guide.title}`}><ChevronRight size={15} /></button></div>;
              })}</div></div>
              <div className="tip-card"><div className="tip-label"><Lightbulb size={14} /> IT Support Tip</div><h4>“ถามให้ชัด ก่อนเริ่มแก้”</h4><p>ถามผู้ใช้ว่าเริ่มมีอาการเมื่อไร มีข้อความอะไรขึ้น และก่อนเกิดเหตุได้เปลี่ยนแปลงอะไรบ้าง — ข้อมูลเหล่านี้ช่วยจำกัดสาเหตุได้เร็วขึ้น</p><BookOpen className="tip-decoration" size={76} /></div>
            </div>
          </>}

          {section !== "Dashboard" && <div className="flex items-end justify-between gap-3">
            <div><div className="eyebrow">FIXLAB LEARNING CENTER</div><h1 className="page-title">{section}</h1><p className="page-subtitle">{pageDescriptions[section]}</p></div>
            {section === "Hardware" || section === "Windows & Software" || section === "Network" || section === "CCTV & Devices" ? <span className="hidden items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-3 py-2 text-[10px] text-slate-500 sm:flex"><BookOpen size={13} className="text-blue-500" /> {guides.filter((guide) => guide.category === section).length} บทเรียน</span> : null}
          </div>}

          {(section === "Hardware" || section === "Windows & Software" || section === "Network" || section === "CCTV & Devices" || section === "Troubleshooting Guide") && <>
            <div className="section-heading"><div><h3>{section === "Troubleshooting Guide" ? "คลังแนวทางแก้ปัญหา" : "บทเรียนทั้งหมด"}</h3><p>เลือกหัวข้อเพื่อดูอาการ สาเหตุ และขั้นตอนวิเคราะห์</p></div></div>
            {renderGuideGrid()}
          </>}

          {section === "Troubleshooting Guide" && <div className="panel mt-5">
            <div className="panel-title"><h3><ClipboardCheck size={15} className="mr-2 inline text-blue-500" />Workflow แก้ปัญหาแบบมืออาชีพ</h3><span>ใช้ได้กับทุก Incident</span></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["01", "ระบุปัญหา", "ถามอาการ ข้อความ error เวลาเริ่มเกิด และผลกระทบต่อผู้ใช้"],
                ["02", "เก็บข้อมูล", "ตรวจสอบขอบเขตและถามว่ามีการเปลี่ยนแปลงอะไรก่อนเกิดเหตุ"],
                ["03", "ตรวจพื้นฐาน", "เช็กไฟ สาย สถานะระบบ และการตั้งค่าที่เกี่ยวข้อง"],
                ["04", "ตั้งสมมติฐาน", "แยกสาเหตุทีละข้อจากหลักฐาน โดยเริ่มจากสิ่งที่เสี่ยงต่ำ"],
                ["05", "ทดลองแก้ไข", "แจ้งผลกระทบและขออนุมัติก่อนเปลี่ยนค่าหรือกระทบงาน"],
                ["06", "ทดสอบและบันทึก", "ยืนยันกับผู้ใช้ บันทึกวิธีแก้และผลลัพธ์; escalate เมื่อเกินสิทธิ์"]
              ].map(([number, title, detail]) => <div key={number} className="flex gap-3 rounded-xl border border-slate-100 p-3"><span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600">{number}</span><div><h4 className="m-0 text-[11px] font-bold">{title}</h4><p className="mb-0 mt-1 text-[10px] leading-5 text-slate-500">{detail}</p></div></div>)}
            </div>
            <div className="warning-box mt-4"><AlertTriangle size={15} className="mt-0.5 flex-none" /><span><strong>ก่อนดำเนินการที่มีความเสี่ยง:</strong> ตรวจสอบ backup, เจ้าของข้อมูล, change window และสิทธิ์อนุมัติ ก่อนลบไฟล์ เปลี่ยน configuration, reset อุปกรณ์ หรือกระทบบริการธุรกิจ</span></div>
          </div>}

          {section === "Commands & Tools" && <>
            <div className="list-controls">
              <label className="flex items-center gap-2 text-[10px] text-slate-400"><Filter size={13} />
                <select className="filter-select" value={commandFilter} onChange={(event) => setCommandFilter(event.target.value)}>
                  <option>ทั้งหมด</option>{Array.from(new Set(commands.map((command) => command.group))).map((group) => <option key={group}>{group}</option>)}
                </select>
              </label><span className="results-count">{filteredCommands.length} คำสั่งและเครื่องมือ</span>
            </div>
            <div className="command-list">{filteredCommands.filter((command) => !query || `${command.name} ${command.purpose} ${command.scenario}`.toLowerCase().includes(query.toLowerCase())).map((command) => <div className="command-card" key={command.name}>
              <div className="command-head"><div className="command-name"><span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600"><Terminal size={15} /></span><div><h3>{command.name}</h3><p>{command.group}</p></div></div><span className="tag">{command.group.includes("Network") ? "Network" : "Windows"}</span></div>
              <div className="code-block"><code>{command.example}</code><button className="copy-button" onClick={() => copyCommand(command.example)}><Copy size={12} /> Copy</button></div>
              <div className="command-detail"><div><strong>จุดประสงค์</strong>{command.purpose}<br /><strong className="mt-2">Syntax</strong><code className="font-mono">{command.syntax}</code></div><div><strong>ผลลัพธ์ที่คาดหวัง</strong>{command.output}<br /><strong className="mt-2">ใช้เมื่อ</strong>{command.scenario}</div></div>
            </div>)}</div>
            <div className="warning-box mt-4"><AlertTriangle size={15} className="mt-0.5 flex-none" /><span>บางคำสั่งต้องใช้สิทธิ์ Administrator และอาจเปลี่ยนสถานะเครือข่ายหรือระบบ ตรวจผลกระทบและขออนุมัติก่อนใช้งานกับเครื่ององค์กร</span></div>
          </>}

          {section === "IT Support Simulator" && <div className="sim-card">
            <div className="sim-progress"><span>สถานการณ์ {Math.min(scenarioIndex + 1, scenarios.length)} จาก {scenarios.length}</span><span>ฝึกวิเคราะห์ปัญหา</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${(scenarioIndex + 1) / scenarios.length * 100}%` }} /></div>
            {scenarioIndex < scenarios.length ? <>
              <span className="scenario-badge"><Activity size={12} /> REAL-WORLD SCENARIO</span>
              <h3>{activeScenario.title}</h3><p>{activeScenario.story}</p>
              <div className="mt-5 text-[10px] font-bold text-slate-500">คุณจะเริ่มตรวจสอบอย่างไร?</div>
              <div className="choice-list">{activeScenario.options.map((option, index) => {
                const selected = scenarioChoice === index;
                const stateClass = scenarioChoice === null ? "" : index === activeScenario.correct ? "correct" : selected ? "incorrect" : "";
                return <button key={option} disabled={scenarioChoice !== null} onClick={() => setScenarioChoice(index)} className={`choice-button ${selected ? "selected" : ""} ${stateClass}`}><span className="grid h-6 w-6 flex-none place-items-center rounded-md bg-slate-100 text-[9px] font-bold">{String.fromCharCode(65 + index)}</span>{option}{scenarioChoice !== null && index === activeScenario.correct && <Check size={14} className="ml-auto" />}</button>;
              })}</div>
              {scenarioChoice !== null && <><div className="feedback-box"><strong>{scenarioChoice === activeScenario.correct ? "ถูกต้อง — เริ่มจากการตรวจสอบที่เสี่ยงต่ำ" : "ลองทบทวนลำดับการแก้ปัญหา"}</strong><br />{activeScenario.feedback}</div><div className="mt-4 flex justify-end"><button className="primary-button" onClick={() => { setScenarioChoice(null); setScenarioIndex((index) => (index + 1) % scenarios.length); }}>สถานการณ์ถัดไป <ArrowRight size={13} /></button></div></>}
            </> : null}
          </div>}

          {section === "Knowledge Quiz" && <div className="sim-card">
            <div className="sim-progress"><span>คำถาม {Math.min(quizIndex + 1, quizQuestions.length)} จาก {quizQuestions.length}</span><span>ตอบถูก {quizAnswers.filter((answer, index) => answer === quizQuestions[index]?.answer).length} ข้อ</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${(quizIndex + 1) / quizQuestions.length * 100}%` }} /></div>
            {quizIndex < quizQuestions.length ? <>
              <span className="scenario-badge"><CircleHelp size={12} /> QUICK KNOWLEDGE CHECK</span>
              <h3>{activeQuiz.q}</h3>
              <div className="choice-list">{activeQuiz.options.map((option, index) => {
                const isChosen = quizChoice === index;
                const answerState = quizChoice === null ? "" : index === activeQuiz.answer ? "correct" : isChosen ? "incorrect" : "";
                return <button key={option} disabled={quizChoice !== null} onClick={() => { setQuizChoice(index); setQuizAnswers((previous) => [...previous, index]); }} className={`choice-button quiz-option ${isChosen ? "selected" : ""} ${answerState}`}><span>{option}</span>{quizChoice !== null && index === activeQuiz.answer && <Check size={14} />}</button>;
              })}</div>
              {quizChoice !== null && <><div className="feedback-box"><strong>{quizChoice === activeQuiz.answer ? "ตอบถูกต้อง!" : "ยังไม่ถูก ลองจำหลักการนี้ไว้"}</strong><br />{activeQuiz.why}</div><div className="mt-4 flex justify-end"><button className="primary-button" onClick={() => { setQuizChoice(null); setQuizIndex((index) => index + 1); }}>{quizIndex === quizQuestions.length - 1 ? "ดูผลคะแนน" : "คำถามถัดไป"} <ArrowRight size={13} /></button></div></>}
            </> : <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Star size={24} /></div>
              <h3 className="mt-4">ทำแบบทดสอบครบแล้ว!</h3>
              <div className="score-card text-left"><span className="text-[11px] font-semibold text-slate-500">คะแนนของคุณ</span><span className="score-number">{quizAnswers.filter((answer, index) => answer === quizQuestions[index]?.answer).length} / {quizQuestions.length}</span></div>
              <div className="text-left">{quizQuestions.map((question, index) => <div key={question.q} className="note-row"><span><strong className="mr-2">{index + 1}.</strong>{question.q}<span className={`ml-2 ${quizAnswers[index] === question.answer ? "text-emerald-600" : "text-rose-500"}`}>{quizAnswers[index] === question.answer ? "ถูก" : "ทบทวน"}</span></span></div>)}</div>
              <button className="primary-button mt-4" onClick={() => { setQuizIndex(0); setQuizChoice(null); setQuizAnswers([]); }}>ทำแบบทดสอบอีกครั้ง <ArrowLeft size={13} /></button>
            </div>}
          </div>}

          {section === "My Learning" && <>
            <div className="stat-grid">
              {[{ label: "เรียนจบแล้ว", value: `${completed.length} / ${guides.length}`, icon: CheckCircle2, color: "#19a36f", bg: "#eaf8f2" }, { label: "บทเรียนที่บันทึก", value: bookmarks.length, icon: Bookmark, color: "#9865df", bg: "#f4efff" }, { label: "บันทึกส่วนตัว", value: notes.length, icon: FileText, color: "#3268f5", bg: "#edf3ff" }, { label: "ความคืบหน้า", value: `${learningPercent}%`, icon: Gauge, color: "#df9237", bg: "#fff5e9" }].map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="stat-card"><div className="stat-icon" style={{ color: stat.color, background: stat.bg }}><Icon size={18} /></div><div><div className="stat-label">{stat.label}</div><div className="stat-value">{stat.value}</div></div></div>; })}
            </div>
            <div className="lower-grid mt-5">
              <div className="panel"><div className="panel-title"><h3><Bookmark size={14} className="mr-2 inline text-violet-500" />บทเรียนที่บันทึกไว้</h3><span>{bookmarks.length} บทเรียน</span></div>
                {bookmarks.length ? <div className="topic-list">{bookmarks.map((id) => { const guide = guides.find((item) => item.id === id); if (!guide) return null; return <div className="topic-row" key={id}><span className="topic-mini-icon"><BookOpen size={15} /></span><div className="topic-main"><strong>{guide.title}</strong><span>{guide.category} · {guide.level}</span></div><button className="row-arrow" onClick={() => openGuide(guide)} aria-label={`เปิด ${guide.title}`}><ChevronRight size={15} /></button></div>; })}</div> : <div className="py-7 text-center text-[10px] text-slate-400">ยังไม่มีบทเรียนที่บันทึก กดรูป bookmark บนบทเรียนเพื่อเก็บไว้อ่านภายหลัง</div>}
                <div className="panel-title mt-5"><h3><CheckCircle2 size={14} className="mr-2 inline text-emerald-500" />เรียนจบแล้ว</h3><span>{completed.length} บทเรียน</span></div>
                {completed.length ? <div className="topic-list">{completed.slice(0, 5).map((id) => { const guide = guides.find((item) => item.id === id); return guide ? <div className="topic-row" key={id}><span className="topic-mini-icon bg-emerald-50 text-emerald-600"><Check size={15} /></span><div className="topic-main"><strong>{guide.title}</strong><span>{guide.category}</span></div><span className="completed-badge">เรียนแล้ว</span></div> : null; })}</div> : <div className="py-5 text-center text-[10px] text-slate-400">เรียนจบบทเรียนแล้วกด “ทำเครื่องหมายว่าเรียนจบ” เพื่อบันทึกความคืบหน้า</div>}
              </div>
              <div className="panel"><div className="panel-title"><h3><FileText size={14} className="mr-2 inline text-blue-500" />Knowledge Notes</h3><span>บันทึกในอุปกรณ์นี้</span></div>
                <form className="note-form" onSubmit={addNote}><input className="note-input" value={newNote} onChange={(event) => setNewNote(event.target.value)} placeholder="จดสิ่งที่ได้เรียนรู้..." aria-label="เขียนบันทึกส่วนตัว" /><button className="primary-button" type="submit"><span className="hidden sm:inline">เพิ่มบันทึก</span><ArrowRight size={13} /></button></form>
                <div className="mt-3">{notes.length ? notes.map((note) => <div className="note-row" key={note.id}><span>{note.text}</span><button className="delete-button" onClick={() => setNotes((previous) => previous.filter((item) => item.id !== note.id))} aria-label="ลบบันทึก"><Trash2 size={13} /></button></div>) : <div className="py-6 text-center text-[10px] text-slate-400">บันทึกส่วนตัวของคุณจะปรากฏที่นี่</div>}</div>
              </div>
            </div>
          </>}

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-[9px] text-slate-400"><span>© 2026 Fixlab · IT Support Learning Center</span><span>เรียนรู้เพื่อการทำงานอย่างปลอดภัยและเป็นระบบ</span></footer>
        </div>
      </main>

      <AnimatePresence>
        {selectedGuide && (() => {
          const guide = selectedGuide;
          const category = categories.find((item) => item.title === guide.category)!;
          const Icon = category.icon;
          const details = lessonDetails(guide);
          const isSaved = bookmarks.includes(guide.id);
          return <motion.div key="guide-dialog" className="fixed inset-0 z-50 overflow-y-auto bg-[#13233d66] px-3 py-6 backdrop-blur-[2px] sm:px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedGuide(null)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="guide-title" className="mx-auto my-auto max-w-[760px] rounded-2xl bg-[#f7f8fb] p-4 shadow-2xl sm:p-6" initial={{ y: 18, opacity: 0, scale: .98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 12, opacity: 0 }} onClick={(event) => event.stopPropagation()}>
              <div className="guide-header"><div><span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold" style={{ color: category.color, background: category.bg }}><Icon size={12} />{guide.category}</span><h3 id="guide-title">{guide.title}</h3><p>{guide.summary}</p></div><button className="close-button" onClick={() => setSelectedGuide(null)} aria-label="ปิดบทเรียน"><X size={15} /></button></div>
              <div className="guide-grid">
                <div className="guide-step"><h4><AlertTriangle size={13} className="text-amber-500" />อาการที่พบ</h4><p>{details.symptoms}</p></div>
                <div className="guide-step"><h4><Search size={13} className="text-blue-500" />สาเหตุที่เป็นไปได้</h4><ul>{details.causes.map((cause) => <li key={cause}>{cause}</li>)}</ul></div>
                <div className="guide-step"><h4><Wrench size={13} className="text-violet-500" />ขั้นตอนวินิจฉัยและแก้ไข</h4><ol>{details.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
                <div className="guide-step"><h4><CheckCircle2 size={13} className="text-emerald-500" />ผลลัพธ์และการป้องกัน</h4><p>ทดสอบอาการเดิมซ้ำกับผู้ใช้และยืนยันว่ากลับมาใช้งานได้ตามปกติ บันทึกสาเหตุ วิธีแก้ และผลทดสอบไว้ใน ticket เพื่อป้องกันและช่วยแก้ปัญหาครั้งต่อไป</p></div>
              </div>
              <div className="warning-box"><AlertTriangle size={15} className="mt-0.5 flex-none" /><span><strong>ข้อควรระวัง:</strong> ก่อนแก้ไข driver, network configuration, disk หรืออุปกรณ์ที่เกี่ยวกับงานองค์กร ให้สำรอง/จดค่าปัจจุบัน แจ้งผลกระทบ และขอ authorization ตามนโยบาย หากข้อมูลเสี่ยงสูญหายหรือบริการธุรกิจได้รับผลกระทบ ให้หยุดและ escalate ไปยัง senior technician</span></div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] text-slate-400"><span><Clock3 size={11} className="mr-1 inline" />ใช้เวลาประมาณ 5 นาที · {guide.level}</span><span>Escalate เมื่ออาการเกิดซ้ำ, เสี่ยงข้อมูลสูญหาย หรือเกินสิทธิ์ผู้ปฏิบัติงาน</span></div>
              <div className="guide-actions">
                <button className="secondary-button" onClick={() => toggleBookmark(guide.id)}><Bookmark size={13} fill={isSaved ? "currentColor" : "none"} />{isSaved ? "บันทึกแล้ว" : "บันทึกไว้"}</button>
                <button className="primary-button" onClick={() => { completeGuide(guide.id); setSelectedGuide(null); }}><Check size={13} />{completed.includes(guide.id) ? "เรียนจบแล้ว" : "ทำเครื่องหมายว่าเรียนจบ"}</button>
              </div>
            </motion.div>
          </motion.div>;
        })()}
      </AnimatePresence>
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><CheckCircle2 size={15} />{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}
