import type { BlogPost } from '../context/StoreContext';

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'b-1',
    title: 'Bí Quyết Phủ Sơn "Liquid Glass" Tạo Đô Bóng Sâu Khó Cưỡng',
    excerpt: 'Khám phá quy trình 5 bước độc quyền tại LEGATO giúp mọi mô hình sở hữu bề mặt bóng loáng như pha lê.',
    content: `
      <h2>1. Liquid Glass là gì?</h2>
      <p>Liquid Glass (Kính lỏng) không chỉ đơn thuần là một lớp sơn phủ. Đây là công nghệ phủ siêu bóng tạo ra hiệu ứng phản chiếu sâu, giúp mô hình của bạn trông như được đúc từ pha lê màu. Tại LEGATO, chúng tôi gọi đây là "linh hồn" của những thiết kế cao cấp.</p>
      
      <img src="/images/custom-logo.png" alt="Liquid glass coating process" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>2. Quy trình 5 bước độc quyền</h2>
      <ul>
        <li><strong>Bước 1:</strong> Xử lý bề mặt siêu mịn bằng máy chà nhám công nghệ cao.</li>
        <li><strong>Bước 2:</strong> Phủ lớp lót bám dính nano.</li>
        <li><strong>Bước 3:</strong> Sơn màu cơ sở (Base coat) với hạt màu siêu nhuyễn.</li>
        <li><strong>Bước 4:</strong> Phủ 3 lớp Liquid Glass cách nhau 8 giờ.</li>
        <li><strong>Bước 5:</strong> Đánh bóng quang học bằng sáp Carnauba cao cấp.</li>
      </ul>
      <p>Kết quả là một tác phẩm nghệ thuật có khả năng phản xạ ánh sáng 360 độ, chống trầy xước nhẹ và bền màu qua hàng thập kỷ.</p>
    `,
    date: '2026-07-04',
    image: '/images/custom-logo.png'
  },
  {
    id: 'b-2',
    title: 'Kỷ Nguyên Mới: Xưởng Đúc Cập Nhật Khuôn Mẫu Size 1000% (70cm)',
    excerpt: 'Đáp ứng nhu cầu decor không gian lớn, LEGATO chính thức ra mắt dòng sản phẩm khổng lồ.',
    content: `
      <h2>Chào Đón Size Khổng Lồ 1000%</h2>
      <p>Với chiều cao lên tới 70cm, những mô hình size 1000% không còn là món đồ chơi để bàn thông thường, chúng là những <strong>tác phẩm điêu khắc nghệ thuật</strong> thực thụ dành cho không gian sống hiện đại.</p>
      
      <img src="/images/custom-logo.png" alt="Large scale mold" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>Tại Sao Nên Chọn Size 1000%?</h2>
      <p>Trong thiết kế nội thất, một điểm nhấn (focal point) có kích thước lớn luôn tạo ra ấn tượng thị giác mạnh mẽ hơn nhiều món đồ nhỏ lẻ. Một chú gấu LEGATO Bear hay một Deadpool khổng lồ đặt tại phòng khách sẽ thể hiện cá tính độc bản của gia chủ.</p>
      <blockquote>"Go big or go home" - Kích thước lớn mang lại sự bề thế và đẳng cấp khác biệt.</blockquote>
    `,
    date: '2026-07-01',
    image: '/images/custom-logo.png'
  },
  {
    id: 'b-3',
    title: 'PLA vs PETG: Chọn Chất Liệu Nào Cho Mô Hình Của Bạn?',
    excerpt: 'So sánh chi tiết hai loại nhựa in 3D phổ biến nhất để tìm ra chân ái cho bộ sưu tập.',
    content: `
      <h2>Tổng Quan Về PLA Và PETG</h2>
      <p>Khi đặt hàng tại LEGATO, bạn có hai lựa chọn chất liệu chính. Mỗi loại đều có ưu điểm riêng phù hợp với từng mục đích trưng bày.</p>
      
      <img src="/images/custom-logo.png" alt="3D Printing materials" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>So Sánh Chi Tiết</h2>
      <h3>1. Nhựa PLA (Polylactic Acid)</h3>
      <p>Là nhựa sinh học an toàn, thân thiện với môi trường. Ưu điểm là bề mặt in siêu nét, chi tiết cao, rất cứng cáp. Phù hợp cho mô hình trưng bày trong nhà, tránh ánh nắng trực tiếp.</p>
      
      <h3>2. Nhựa PETG (Polyethylene Terephthalate Glycol)</h3>
      <p>Chất liệu bền bỉ, chịu lực tốt và chịu được nhiệt độ cao (lên tới 80°C). Nếu bạn định trưng bày mô hình gần cửa sổ, ngoài ban công hoặc trong xe hơi, PETG là sự lựa chọn tối ưu, dù giá thành nhỉnh hơn 20%.</p>
    `,
    date: '2026-06-28',
    image: '/images/custom-logo.png'
  },
  {
    id: 'b-4',
    title: 'Top 5 Mô Hình LEGATO Bear Được Săn Lùng Nhiều Nhất 2026',
    excerpt: 'Điểm danh những thiết kế LEGATO Bear đang làm mưa làm gió trên thị trường decor cao cấp.',
    content: `
      <h2>Sức Hút Của LEGATO Bear</h2>
      <p>Không chỉ là một món đồ trang trí, LEGATO Bear đã trở thành một biểu tượng của phong cách sống (lifestyle). Dưới đây là 5 mẫu được yêu thích nhất trong năm nay.</p>
      
      <img src="/images/custom-logo.png" alt="Trendy figures" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>Bảng Xếp Hạng</h2>
      <ol>
        <li><strong>LEGATO Bear - Đen Nhám Huyền Bí:</strong> Sự tối giản lên ngôi. Phù hợp mọi không gian kiến trúc.</li>
        <li><strong>LEGATO Bear - Vàng Hồng Phủ Bóng:</strong> Dành cho những ai yêu thích sự sang trọng, quý phái.</li>
        <li><strong>LEGATO Bear - Gradient Biển Sâu:</strong> Kỹ thuật sơn chuyển màu đỉnh cao.</li>
        <li><strong>LEGATO Bear - Phiên Bản Siêu Anh Hùng:</strong> Kết hợp văn hóa pop-culture đầy màu sắc.</li>
        <li><strong>LEGATO Bear - Chrome Bạc:</strong> Hiệu ứng gương phản chiếu cực kỳ bắt mắt.</li>
      </ol>
      <p>Bạn đã sở hữu mẫu nào trong bộ sưu tập của mình chưa?</p>
    `,
    date: '2026-06-25',
    image: '/images/custom-logo.png'
  },
  {
    id: 'b-5',
    title: 'Nghệ Thuật Custom Mô Hình: Khi Trí Tưởng Tượng Không Giới Hạn',
    excerpt: 'Dịch vụ thiết kế theo yêu cầu (Custom) tại LEGATO mang đến những tác phẩm duy nhất trên thế giới.',
    content: `
      <h2>Tại Sao Cần Custom Mô Hình?</h2>
      <p>Trong một thế giới đề cao sự cá nhân hóa, việc sở hữu một món đồ không "đụng hàng" là nhu cầu tất yếu. LEGATO tự hào mang đến dịch vụ Custom từ A-Z.</p>
      
      <img src="/images/custom-logo.png" alt="Custom painting art" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>Quy Trình Custom</h2>
      <ul>
        <li><strong>Tư Vấn Ý Tưởng:</strong> Bạn có thể mang đến bản phác thảo, màu sắc yêu thích hoặc một câu chuyện. Designer của chúng tôi sẽ số hóa nó.</li>
        <li><strong>In 3D Prototype:</strong> Dựng hình và in mẫu thử để kiểm tra tỉ lệ.</li>
        <li><strong>Sơn Thủ Công (Hand-painted):</strong> Những họa sĩ tài năng nhất sẽ khoác lên mô hình những gam màu độc đáo, sắc nét đến từng milimet.</li>
      </ul>
      <p>Một món quà tặng doanh nghiệp hay quà kỷ niệm mang đậm dấu ấn cá nhân? Dịch vụ Custom sinh ra là dành cho bạn.</p>
    `,
    date: '2026-06-20',
    image: '/images/custom-logo.png'
  },
  {
    id: 'b-6',
    title: 'Cách Phối Đồ Decor Trong Phòng Khách Với Figure Khổ Lớn',
    excerpt: 'Bí kíp thiết kế nội thất: Biến mô hình khổng lồ thành trái tim của căn phòng.',
    content: `
      <h2>Nguyên Tắc Bố Cục</h2>
      <p>Rất nhiều khách hàng bối rối khi rước một em mô hình size 1000% (70cm) về nhà. Dưới đây là một số mẹo từ các chuyên gia thiết kế nội thất.</p>
      
      <img src="/images/custom-logo.png" alt="Interior design with figure" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>Các Vị Trí Đắc Địa</h2>
      <ul>
        <li><strong>Góc Sofa:</strong> Đặt cạnh ghế sofa cùng một chiếc đèn đứng, ánh sáng sẽ làm tôn lên lớp sơn Liquid Glass.</li>
        <li><strong>Kệ Tivi:</strong> Nếu kệ tivi đủ dài, đặt ở một góc trống sẽ cân bằng lại mảng tường lớn của tivi.</li>
        <li><strong>Lối Vào (Entryway):</strong> Một lời chào đón cực kỳ phong cách cho bất kỳ vị khách nào bước vào nhà.</li>
      </ul>
      <p>Lưu ý: Hãy đảm bảo màu sắc mô hình có sự liên kết (tone-sur-tone hoặc tương phản) với rèm cửa, thảm hoặc gối tựa.</p>
    `,
    date: '2026-06-15',
    image: '/images/custom-logo.png'
  },
  {
    id: 'b-7',
    title: 'Khám Phá Văn Hóa Sưu Tầm Art Toy Ở Việt Nam',
    excerpt: 'Từ thú vui ngách (niche) đến trào lưu phong cách sống đẳng cấp của giới trẻ và người thành đạt.',
    content: `
      <h2>Sự Trỗi Dậy Của Art Toy</h2>
      <p>Trong 5 năm trở lại đây, thị trường Art Toy (Đồ chơi nghệ thuật) tại Việt Nam bùng nổ mạnh mẽ. Không chỉ là đồ chơi, chúng được coi là tác phẩm nghệ thuật có giá trị sưu tầm và đầu tư.</p>
      
      <img src="/images/custom-logo.png" alt="Art toy collection" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>Giá Trị Nằm Ở Đâu?</h2>
      <p>Người chơi Art Toy sẵn sàng chi trả số tiền lớn bởi các yếu tố:</p>
      <ul>
        <li><strong>Tính Giới Hạn (Limited Edition):</strong> Sự khan hiếm tạo nên giá trị độc tôn.</li>
        <li><strong>Giá Trị Nghệ Thuật:</strong> Sự kết hợp giữa điêu khắc, hội họa và thiết kế đương đại.</li>
        <li><strong>Cộng Đồng:</strong> Cảm giác thuộc về một cộng đồng tinh hoa, chia sẻ đam mê và phong cách sống.</li>
      </ul>
      <p>LEGATO tự hào là một trong những thương hiệu tiên phong mang chuẩn mực Art Toy quốc tế đến với người dùng Việt qua công nghệ in 3D hiện đại nhất.</p>
    `,
    date: '2026-06-10',
    image: '/images/custom-logo.png'
  },
  {
    id: 'b-8',
    title: 'Hậu Trường Chế Tác: Deadpool "Kẻ Đáng Ghét"',
    excerpt: 'Cùng xem đội ngũ LEGATO đã đưa chàng lính đánh thuê lắm mồm từ bản vẽ 3D ra đời thực như thế nào.',
    content: `
      <h2>Từ Concept Đến Bản In 3D</h2>
      <p>Deadpool luôn là một trong những nhân vật được yêu cầu nhiều nhất. Thử thách của chúng tôi là làm sao bắt được cái thần thái "nhây" nhưng vẫn cực kỳ ngầu của anh chàng.</p>
      
      <img src="/images/custom-logo.png" alt="Deadpool figure crafting" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>Quy Trình Hoàn Thiện</h2>
      <p>Bản phác thảo 3D tiêu tốn hơn 40 giờ đồng hồ để tinh chỉnh tỉ lệ cơ bắp và nếp gấp trang phục. Quá trình in 3D mất thêm 30 giờ liên tục với độ phân giải siêu cao.</p>
      <p>Điểm nhấn chính là lớp sơn đỏ đặc trưng kết hợp với kỹ thuật giả cổ (weathering), tạo cảm giác bộ giáp đã trải qua vô số trận chiến. Mỗi phiên bản Deadpool tại LEGATO đều được xử lý thủ công, đảm bảo không có hai bản nào hoàn toàn giống nhau.</p>
    `,
    date: '2026-06-05',
    image: '/images/custom-logo.png'
  },
  {
    id: 'b-9',
    title: 'Bảo Quản Mô Hình Resin/PLA Đúng Cách Để Bền Đẹp Theo Năm Tháng',
    excerpt: 'Những lưu ý quan trọng mà bất cứ "dân chơi" hệ decor nào cũng phải nắm lòng.',
    content: `
      <h2>Kẻ Thù Của Mô Hình</h2>
      <p>Dù được chế tác cực kỳ kỹ lưỡng, mô hình của bạn vẫn cần được chăm sóc để giữ nguyên giá trị thẩm mỹ. Ba "kẻ thù" lớn nhất là: Ánh nắng, Nhiệt độ và Bụi bẩn.</p>
      
      <img src="/images/custom-logo.png" alt="Cleaning models" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>Cẩm Nang Bảo Quản</h2>
      <ul>
        <li><strong>Tránh tia UV:</strong> Ánh nắng mặt trời trực tiếp có thể làm phai màu sơn và làm giòn nhựa. Tuyệt đối không trưng bày ngoài trời hoặc sát cửa kính hứng nắng.</li>
        <li><strong>Nhiệt Độ Thích Hợp:</strong> Giữ mô hình ở nhiệt độ phòng (20-30°C). Tránh xa bếp lò, đèn sưởi hay các nguồn phát nhiệt.</li>
        <li><strong>Vệ Sinh Định Kỳ:</strong> Dùng chổi lông mềm (cọ trang điểm là một lựa chọn tuyệt vời) để phủi bụi nhẹ nhàng 1-2 tuần/lần. Tránh dùng khăn ướt có hóa chất tẩy rửa.</li>
      </ul>
      <p>Chỉ cần chút lưu tâm, bộ sưu tập của bạn sẽ luôn rực rỡ như ngày đầu tiên.</p>
    `,
    date: '2026-06-01',
    image: '/images/custom-logo.png'
  },
  {
    id: 'b-10',
    title: 'Xu Hướng Decor Tương Lai: Sự Giao Thoa Giữa Công Nghệ Và Nghệ Thuật',
    excerpt: 'In 3D đang thay đổi ngành trang trí nội thất như thế nào?',
    content: `
      <h2>Cuộc Cách Mạng In 3D</h2>
      <p>Công nghệ in 3D không chỉ giải phóng ranh giới của trí tưởng tượng mà còn dân chủ hóa nghệ thuật. Những thiết kế điêu khắc phức tạp trước đây tốn hàng tháng trời của các nghệ nhân, nay có thể được chế tác với độ chính xác tuyệt đối.</p>
      
      <img src="/images/custom-logo.png" alt="Future tech 3D" style="width: 100%; border-radius: 8px; margin: 1rem 0;; background: var(--color-surface); object-fit: contain; aspect-ratio: 16/9;" />
      
      <h2>LEGATO - Tiên Phong Đón Đầu Xu Hướng</h2>
      <p>Tại LEGATO, chúng tôi kết hợp sự tinh xảo của máy móc hiện đại và cái hồn của nghệ nhân thủ công. Việc ứng dụng công nghệ cho phép chúng tôi cá nhân hóa sản phẩm tối đa với mức chi phí hợp lý nhất cho người dùng.</p>
      <p>Decor tương lai không chỉ là đồ trang trí vô tri, mà là sự phản chiếu bản ngã của người sở hữu. LEGATO Bear chính là minh chứng rõ ràng nhất cho triết lý này.</p>
    `,
    date: '2026-05-28',
    image: '/images/custom-logo.png'
  }
];
