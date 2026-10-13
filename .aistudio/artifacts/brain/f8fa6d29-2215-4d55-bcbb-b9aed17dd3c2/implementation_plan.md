# Xế Chiều Studio — Studio Tạo Hình Ảnh Hoạt Hình Kể Chuyện Kịch Bản

Studio chuyên nghiệp tối ưu hóa cho người sáng tạo nội dung YouTube độc lập: biến kịch bản văn học tiếng Việt thành chuỗi hình ảnh hoạt hình 2D đồng bộ nhân vật, bối cảnh, hàng chờ sinh ảnh máy chủ tin cậy và bộ xuất dữ liệu dựng video chuẩn hóa.

## User Review & Critical Decisions

> [!IMPORTANT]
> Dưới đây là các quyết định cốt lõi đã được xác nhận qua phản hồi của bạn để đảm bảo ứng dụng vận hành đúng theo tôn chỉ kênh "Xế Chiều Studio":

- **Cơ chế AI tạo ảnh xác nhận**: Tích hợp trực tiếp Google AI Studio Gemini API qua proxy máy chủ (sử dụng `@google/genai` với `GEMINI_API_KEY`), đồng thời cung cấp giao diện quản lý kết nối, tùy chọn khóa cá nhân và chế độ mẫu an toàn khi ngoại tuyến.
- **Kịch bản mẫu chuẩn xác nhận**: Tích hợp sẵn trích đoạn kinh điển *"Một bữa no"* (Nam Cao) được phân tích chuẩn hóa với hồ sơ nhân vật (Bà cái Tý, cháu gái, bà phó Thụ), các góc mặt và bộ phân cảnh minh họa để người dùng thử nghiệm toàn bộ quy trình ngay lập tức.
- **Định phong cách đồ họa kênh**: Chuẩn hóa phong cách *"Hoạt hình Xế Chiều"* (Hoạt hình 2D Việt Nam tối giản, đầu to chiếm ~1/2 cơ thể, nét viền đen dày mộc mạc, màu phẳng gam kem/nâu đất/chàm xám/da ấm, nền lược giản 1–3 chi tiết, không lạm dụng 3D hay texture cầu kỳ).

---

## 1. Overview & Core Concept

- **Mục tiêu ứng dụng**: Giúp người làm kênh *"Xế Chiều Studio"* chuyển đổi kịch bản truyện/văn học (như Nam Cao, Vũ Trọng Phụng, truyện dân gian, truyện ngắn) thành toàn bộ tư liệu hình ảnh phân cảnh có tính nhất quán cao về diện mạo nhân vật và phong cách đồ họa, sẵn sàng cho công đoạn dựng phim.
- **Đối tượng sử dụng**: Nhà sáng tạo nội dung YouTube solo, biên tập viên video, người kể chuyện podcast có minh họa.
- **Giá trị cốt lõi**:
  - Không cần người dùng biết viết prompt phức tạp: hệ thống tự động biên dịch hồ sơ nhân vật, bối cảnh và hành động thành prompt chuẩn theo version.
  - Quản lý nhân vật & Reference chuyên sâu: Khóa góc mặt, trang phục cố định, phân biệt nhân vật trong truyện với người dẫn chuyện (Host áo thun mũ 37).
  - Mapping chính xác từng câu kịch bản với từng khung cảnh (không bị lệch lời đọc).
  - Hàng chờ tạo ảnh bền vững (Pause, Resume, Retry với backoff, không mất việc khi refresh tab).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Khởi tạo & Nhập liệu**:
   - Dán kịch bản hoặc tải file TXT/MD, chọn tỉ lệ khung hình (16:9 mặc định YouTube, 9:16 Shorts, 1:1), chọn mật độ cảnh (Ít / Vừa / Nhiều).
   - Nút chọn nạp ngay *"Một bữa no (Mẫu chuẩn)"* để kiểm nghiệm tức thì.
2. **Phân tích Cốt truyện & Nhân vật**:
   - AI phân tích tách nhân vật, vai trò, trang phục, các mốc thời kỳ tuổi, địa điểm, đạo cụ cốt lõi (ví dụ: bát cháo, hai đồng xu).
   - Duyệt và khóa hồ sơ nhân vật, tạo/chọn ảnh Reference (chính diện, góc nghiêng, toàn thân).
3. **Storyboard 3 Vùng Biên Tập (Desktop Workspace)**:
   - **Vùng trái (280px)**: Kịch bản gốc với highlight vị trí đọc tương ứng với từng cảnh được chọn.
   - **Vùng giữa (Linh hoạt)**: Bảng phân cảnh dạng lưới hoặc danh sách, hiển thị ảnh preview 16:9, trạng thái duyệt (`chưa duyệt`, `đã duyệt`, `cần sửa`, `lỗi`).
   - **Vùng phải (320px)**: Inspector chi tiết cảnh: nhân vật tham gia, góc quay, hành động, đạo cụ, prompt đã biên dịch, các nút tinh chỉnh nhanh (*"Cận hơn"*, *"Đổi góc"*, *"Nền gọn hơn"*, *"Sửa đạo cụ"*).
4. **Hàng chờ & Tinh chỉnh**:
   - Drawer hàng chờ tạo ảnh (hiển thị tiến trình, nút Tạm dừng, Tiếp tục, Thử lại cảnh lỗi).
   - Khả năng sửa ảnh: tạo biến thể mới giữ nguyên lịch sử, so sánh trước/sau và hoàn tác bản cũ.
5. **Duyệt & Xuất Sản Phẩm**:
   - Xuất trọn gói file ZIP chứa ảnh đã đánh số (`S001_...`, `S002_...`), file CSV mapping lời đọc ↔ cảnh, danh sách Prompt và file dự án JSON backup.

### Visual Identity & Theme Tokens

- **Định hướng thẩm mỹ**: Giao diện công cụ biên tập hiện đại, tối giản, sáng rõ (Professional Studio Tool), ưu tiên độ nổi bật của hình ảnh tác phẩm.
- **Bảng màu**:
  - Nền chính: `#F5F6F8` (Sáng chuẩn studio) / Dark mode: `#11151D`
  - Panel & Card: `#FFFFFF` / Dark mode: `#1A202C`
  - Màu nhấn hành động (Primary): `#4F46E5` (Indigo studio)
  - Màu thương hiệu Xế Chiều: `#C97645` (Cam đất hoài niệm) điểm xuyết logo & huy hiệu
  - Đường viền hairline: `#E4E7EC` / `#2D3748`
- **Typography**: Sans-serif tiếng Việt tối ưu (`Plus Jakarta Sans` / `Outfit` kết hợp `Public Sans`), chữ số kỹ thuật `tabular-nums` / `font-mono` cho số cảnh và bộ đếm hàng chờ.
- **Tránh AI Slop**: Không dùng gradient màu tím vô nghĩa, không dùng static pill rườm rà, các thẻ trạng thái thể hiện bằng typography tinh gọn và ký hiệu phân biệt rõ ràng.

---

## 3. Key Product Decisions & Trade-Offs

- **Quyết định 1: Server-side Gemini API Proxy qua Vite/Express Middleware**:
  - *Lựa chọn*: Tích hợp endpoint backend xử lý gọi `@google/genai` (phân tích kịch bản bằng `gemini-3.8-flash`, sinh ảnh chất lượng cao và biên tập ảnh), giữ kín `GEMINI_API_KEY` phía server theo đúng khuyến nghị bảo mật.
  - *Lợi ích*: Trực tiếp hoạt động với tài nguyên AI Studio, không làm lộ token ra trình duyệt.
- **Quyết định 2: Quản lý tính nhất quán nhân vật qua Reference Versioning**:
  - *Lựa chọn*: Mỗi nhân vật lưu ID cố định kèm `approved_reference_ids` và `fixed_traits` (đặc điểm không đổi: dạng mặt, kiểu tóc, màu áo mộc, tỉ lệ). Prompt sinh từng cảnh luôn snapshot từ version được duyệt thay vì cho AI tự do viết lại từ đầu.
  - *Lợi ích*: Giảm thiểu tối đa hiện tượng trôi nhận diện (drift) qua các cảnh.
- **Quyết định 3: Lưu trữ bền vững phía Client & Server**:
  - *Lựa chọn*: Lưu trạng thái dự án, lịch sử phiên bản ảnh và hàng chờ trong LocalStorage/IndexedDB có hỗ trợ Export/Import JSON nguyên vẹn.
  - *Lợi ích*: Người dùng đóng tab, mở lại tab hoặc refresh trang không bao giờ bị mất tác vụ hàng chờ hay ảnh đã duyệt.

---

## 4. Technical Architecture & Data Strategy

### Kiến trúc tổng thể

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Xế Chiều Studio Web UI                          │
├─────────────────┬──────────────────────────────────┬───────────────────┤
│ Left Panel      │ Center Viewport                  │ Right Inspector   │
│ Kịch bản nguồn  │ Storyboard (Lưới / Danh sách)    │ Chi tiết cảnh     │
│ Đoạn đọc & Map  │ Thẻ cảnh 16:9 + Trạng thái duyệt │ Đạo cụ & Góc nhìn │
│ Danh sách nhân  │ Drawer Hàng chờ (Queue Manager)  │ Prompt Compiler   │
│ vật & bối cảnh  │ Bộ lọc cảnh & Thao tác lô        │ Sửa & So sánh ảnh │
└────────┬────────┴─────────────────┬────────────────┴─────────┬─────────┘
         │                          │                          │
         ▼                          ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Client State Manager (Zustand/Context)              │
│ Projects • ScriptVersions • Characters • Scenes • Queue • ImageAssets  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP API Requests
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Server API Proxy (Express / Vite Middleware)         │
├────────────────────────────────────────────────────────────────────────┤
│ • POST /api/analyze-script   : Phân tích kịch bản & gợi ý nhân vật/cảnh│
│ • POST /api/generate-image   : Sinh ảnh theo prompt + reference snapshot│
│ • POST /api/edit-image       : Sửa ảnh theo mô tả cục bộ               │
│ • GET  /api/health           : Kiểm tra trạng thái kết nối Gemini      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ @google/genai
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Google Gemini AI API                             │
│       (Text: gemini-3.8-flash | Image: gemini-3.1-flash-lite-image)    │
└────────────────────────────────────────────────────────────────────────┘
```

### Mô hình thực thể dữ liệu

- **Project**: `id`, `title`, `aspectRatio`, `styleVersionId`, `createdAt`, `updatedAt`
- **ScriptVersion**: `id`, `originalText`, `paragraphs`, `sourceSpans`
- **Character**: `id`, `name`, `aliases`, `role`, `fixedTraits`, `references` (mặt chính diện, nghiêng, toàn thân)
- **Location**: `id`, `name`, `description`, `keyElements`, `references`
- **Scene**: `id`, `order`, `scriptExcerpt`, `paragraphId`, `kind` (`narrative` | `commentary` | `flashback`), `action`, `emotion`, `cameraAngle`, `cast`, `props`, `selectedAssetId`, `reviewStatus` (`unreviewed` | `approved` | `needs_fix` | `rejected`), `compiledPrompt`
- **GenerationTask**: `id`, `sceneId`, `type` (`generate` | `edit` | `character_sheet`), `state` (`queued` | `running` | `succeeded` | `failed`), `retries`, `createdAt`
- **ImageAsset**: `id`, `sceneId`, `dataUrl`, `promptSnapshot`, `createdAt`, `isApproved`

### Giai đoạn triển khai (Implementation Steps)

1. **Bước 1: Thiết lập nền tảng & API Server**:
   - Cấu hình server proxy trong `server.ts` / middleware xử lý các route `/api/analyze-script`, `/api/generate-image`, `/api/edit-image`, `/api/health` với `@google/genai`.
   - Cung cấp mock fallback thông minh khi môi trường chưa có key để người dùng luôn chạy thử được trơn tru.
2. **Bước 2: Cấu trúc dữ liệu & Kịch bản mẫu *"Một bữa no"***:
   - Xây dựng store lưu trữ trạng thái đầy đủ theo đặc tả tài liệu (nhân vật, bối cảnh, phân cảnh có mapping text, hàng chờ).
   - Nạp sẵn bộ dữ liệu mẫu kinh điển tác phẩm *"Một bữa no"* của Nam Cao đã phân tích chuẩn xác.
3. **Bước 3: Giao diện 3 Vùng Studio (Workspace)**:
   - Header: Thông tin dự án, trạng thái lưu, nút Xuất dữ liệu, nút mở Hàng chờ.
   - Vùng kịch bản: Hỗ trợ dán văn bản mới, cuộn đồng bộ tới đoạn đọc khi chọn cảnh.
   - Vùng Storyboard: Thẻ cảnh 16:9, lọc theo trạng thái (`tất cả`, `chưa tạo`, `đã duyệt`, `cần sửa`), thao tác chọn nhiều cảnh.
   - Vùng Inspector: Xem & chỉnh sửa mô tả hành động, đạo cụ, camera, nhân vật tham gia, nút tinh chỉnh nhanh.
4. **Bước 4: Trình quản lý nhân vật & Thư viện phong cách**:
   - Màn hình quản lý hồ sơ nhân vật (khóa tóc, áo, mặt, tạo ảnh mẫu 3 góc nhìn).
   - Tùy chỉnh style preset *"Hoạt hình Xế Chiều"* và cho phép tải ảnh style tham khảo.
5. **Bước 5: Trình thực thi hàng chờ (Queue Engine) & Sửa ảnh**:
   - Quản lý hàng chờ có Pause / Resume / Cancel / Retry.
   - Hỗ trợ tạo biến thể ảnh mới, so sánh trước sau, duyệt ảnh hoặc đánh dấu cần sửa.
6. **Bước 6: Xuất gói sản phẩm & Kiểm thử**:
   - Xuất ZIP chứa ảnh theo chuẩn tên `S001_...png`, file CSV mapping lời thoại, prompt TXT và JSON sao lưu.
   - Kiểm tra tương thích giao diện desktop và thu gọn trên màn hình hẹp, chạy lệnh `compile_applet`.
