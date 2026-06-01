package com.library.config;

import com.library.model.*;
import com.library.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) {
        initRoles();
        initAdminUser();
        initCategories();
        initUsers();
        initBooks();
        initBorrowRecords();
    }

    private void initRoles() {
        for (Role.RoleName name : Role.RoleName.values()) {
            if (roleRepository.findByName(name).isEmpty()) {
                roleRepository.save(new Role(name));
                log.info("✅ Đã tạo role: {}", name);
            }
        }
    }

    private void initAdminUser() {
        if (userRepository.existsByUsername("admin")) {
            return;
        }

        Role adminRole = roleRepository.findByName(Role.RoleName.ADMIN)
                .orElseThrow();

        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("Admin@123"))
                .email("admin@library.edu.vn")
                .fullName("Quản trị viên hệ thống")
                .role(adminRole)
                .isActive(true)
                .build();

        userRepository.save(admin);
        log.info("✅ Đã tạo tài khoản admin (username: admin / password: Admin@123)");
        log.info("⚠️  Vui lòng đổi mật khẩu admin sau khi đăng nhập lần đầu!");
    }

    private void initCategories() {
        if (!categoryRepository.findAll().isEmpty()) {
            return;
        }

        List<Category> categories = List.of(
            Category.builder().name("Khoa học tự nhiên").description("Sách về toán, lý, hóa, sinh học và các môn khoa học tự nhiên").build(),
            Category.builder().name("Văn học").description("Tiểu thuyết, truyện ngắn, thơ, văn học Việt Nam và thế giới").build(),
            Category.builder().name("Công nghệ thông tin").description("Sách về lập trình, cơ sở dữ liệu, mạng máy tính và công nghệ mới").build(),
            Category.builder().name("Lịch sử").description("Sách lịch sử Việt Nam và thế giới").build(),
            Category.builder().name("Kinh tế").description("Sách về kinh tế, tài chính, quản trị kinh doanh").build(),
            Category.builder().name("Ngoại ngữ").description("Sách học tiếng Anh, tiếng Pháp và các ngoại ngữ khác").build(),
            Category.builder().name("Triết học").description("Sách triết học, tâm lý học và phát triển bản thân").build(),
            Category.builder().name("Nghệ thuật").description("Sách về hội họa, âm nhạc, nhiếp ảnh và các loại hình nghệ thuật").build()
        );

        categoryRepository.saveAll(categories);
        log.info("✅ Đã tạo {} danh mục sách", categories.size());
    }

    private void initUsers() {
        if (userRepository.existsByUsername("librarian")) {
            return;
        }

        Role librarianRole = roleRepository.findByName(Role.RoleName.LIBRARIAN).orElseThrow();
        Role studentRole = roleRepository.findByName(Role.RoleName.STUDENT).orElseThrow();

        // Tạo thủ thư
        List<User> librarians = List.of(
            User.builder().username("librarian").password(passwordEncoder.encode("Lib@123"))
                .email("librarian@library.edu.vn").fullName("Nguyễn Thị Mai").phone("0901234567").role(librarianRole).isActive(true).build(),
            User.builder().username("thukho").password(passwordEncoder.encode("Tk@123"))
                .email("tkho@library.edu.vn").fullName("Trần Văn Khoa").phone("0901234568").role(librarianRole).isActive(true).build()
        );
        userRepository.saveAll(librarians);

        // Tạo sinh viên mẫu
        List<User> students = List.of(
            User.builder().username("student001").password(passwordEncoder.encode("Student@123"))
                .email("sinh Vien@student.edu.vn").fullName("Lê Hoàng Nam").phone("0911111111")
                .studentId("SV001").role(studentRole).isActive(true).build(),
            User.builder().username("student002").password(passwordEncoder.encode("Student@123"))
                .email("phuong@student.edu.vn").fullName("Phạm Thị Phương").phone("0911111112")
                .studentId("SV002").role(studentRole).isActive(true).build(),
            User.builder().username("student003").password(passwordEncoder.encode("Student@123"))
                .email("minh@student.edu.vn").fullName("Nguyễn Minh Đức").phone("0911111113")
                .studentId("SV003").role(studentRole).isActive(true).build(),
            User.builder().username("student004").password(passwordEncoder.encode("Student@123"))
                .email("linh@student.edu.vn").fullName("Trần Thị Linh").phone("0911111114")
                .studentId("SV004").role(studentRole).isActive(true).build(),
            User.builder().username("student005").password(passwordEncoder.encode("Student@123"))
                .email("huy@student.edu.vn").fullName("Võ Minh Huy").phone("0911111115")
                .studentId("SV005").role(studentRole).isActive(true).build()
        );
        userRepository.saveAll(students);

        log.info("✅ Đã tạo {} thủ thư và {} sinh viên mẫu", librarians.size(), students.size());
    }

    private void initBooks() {
        if (bookRepository.count() > 0) {
            return;
        }

        List<Category> categories = categoryRepository.findAll();
        Category itCategory = categories.stream().filter(c -> c.getName().equals("Công nghệ thông tin")).findFirst().orElse(categories.get(0));
        Category literatureCategory = categories.stream().filter(c -> c.getName().equals("Văn học")).findFirst().orElse(categories.get(1));
        Category scienceCategory = categories.stream().filter(c -> c.getName().equals("Khoa học tự nhiên")).findFirst().orElse(categories.get(2));
        Category historyCategory = categories.stream().filter(c -> c.getName().equals("Lịch sử")).findFirst().orElse(categories.get(3));
        Category economyCategory = categories.stream().filter(c -> c.getName().equals("Kinh tế")).findFirst().orElse(categories.get(4));

        List<Book> books = List.of(
            // Sách CNTT
            Book.builder().title("Lập Trình Java Cơ Bản").isbn("978-604-80-1234-5").author("Nguyễn Văn A")
                .publisher("NXB Giáo dục").publishedYear(2023).category(itCategory)
                .description("Sách hướng dẫn lập trình Java từ cơ bản đến nâng cao").totalCopies(5).availableCopies(5).build(),
            Book.builder().title("Cơ Sở Dữ Liệu SQL Server").isbn("978-604-80-1234-6").author("Trần Thị B")
                .publisher("NXB Thông tin").publishedYear(2022).category(itCategory)
                .description("Hướng dẫn thiết kế và quản lý cơ sở dữ liệu SQL Server").totalCopies(3).availableCopies(3).build(),
            Book.builder().title("Python Cho Người Mới Bắt Đầu").isbn("978-604-80-1234-7").author("Lê Văn C")
                .publisher("NXB Khoa học").publishedYear(2024).category(itCategory)
                .description("Nhập môn Python với các ví dụ thực tế").totalCopies(4).availableCopies(4).build(),
            Book.builder().title("Lập Trình Web Với React").isbn("978-604-80-1234-8").author("Phạm Thị D")
                .publisher("NXB Công nghệ").publishedYear(2023).category(itCategory)
                .description("Hướng dẫn lập trình web hiện đại với React").totalCopies(3).availableCopies(3).build(),

            // Sách Văn học
            Book.builder().title("Truyện Kiều").isbn("978-601-01-0001-2").author("Nguyễn Du")
                .publisher("NXB Văn học").publishedYear(2021).category(literatureCategory)
                .description("Truyện thơ lục bát kinh điển của văn học Việt Nam").totalCopies(5).availableCopies(5).build(),
            Book.builder().title("Tắt Đèn").isbn("978-601-01-0001-3").author("Ngô Tất Tố")
                .publisher("NXB Văn học").publishedYear(2020).category(literatureCategory)
                .description("Tiểu thuyết về đời sống nông thôn Việt Nam thời Pháp thuộc").totalCopies(3).availableCopies(3).build(),
            Book.builder().title("1984").isbn("978-045-152-493-4").author("George Orwell")
                .publisher("Penguin Books").publishedYear(2021).category(literatureCategory)
                .description("Tiểu dystopia nổi tiếng về một xã hội toàn trị").totalCopies(4).availableCopies(4).build(),

            // Sách Khoa học
            Book.builder().title("Toán Học Cao Cấp - Tập 1").isbn("978-604-80-2001-1").author("Trần Văn Hùng")
                .publisher("NXB Giáo dục").publishedYear(2022).category(scienceCategory)
                .description("Giáo trình toán cao cấp cho sinh viên đại học").totalCopies(6).availableCopies(6).build(),
            Book.builder().title("Vật Lý Đại Cương").isbn("978-604-80-2001-2").author("Nguyễn Văn Minh")
                .publisher("NXB Khoa học").publishedYear(2021).category(scienceCategory)
                .description("Tổng hợp kiến thức vật lý đại cương").totalCopies(4).availableCopies(4).build(),

            // Sách Lịch sử
            Book.builder().title("Lịch Sử Việt Nam - Tập 1").isbn("978-604-80-3001-1").author("Phan Thuần")
                .publisher("NXB Lịch sử").publishedYear(2020).category(historyCategory)
                .description("Lịch sử Việt Nam từ nguồn gốc đến thế kỷ X").totalCopies(3).availableCopies(3).build(),
            Book.builder().title("Việt Nam Sử Lược").isbn("978-604-80-3001-2").author("Trần Trọng Kim")
                .publisher("NXB Văn học").publishedYear(2019).category(historyCategory)
                .description("Khái quát lịch sử Việt Nam").totalCopies(2).availableCopies(2).build(),

            // Sách Kinh tế
            Book.builder().title("Kinh Tế Học Vi Mô").isbn("978-604-80-4001-1").author("Mankiw")
                .publisher("NXB Tài chính").publishedYear(2022).category(economyCategory)
                .description("Giáo trình kinh tế học vi mô chuẩn quốc tế").totalCopies(4).availableCopies(4).build(),
            Book.builder().title("Quản Trị Kinh Doanh").isbn("978-604-80-4001-2").author("Lê Thị Lan")
                .publisher("NXB Kinh tế").publishedYear(2023).category(economyCategory)
                .description("Cơ bản về quản trị kinh doanh").totalCopies(3).availableCopies(3).build()
        );

        bookRepository.saveAll(books);
        log.info("✅ Đã tạo {} đầu sách", books.size());

        // Tạo BookCopy cho mỗi sách
        for (Book book : books) {
            List<BookCopy> copies = new java.util.ArrayList<>();
            for (int i = 1; i <= book.getTotalCopies(); i++) {
                BookCopy copy = BookCopy.builder()
                    .book(book)
                    .barcode(book.getIsbn() + "-CP" + String.format("%02d", i))
                    .condition(BookCopy.Condition.GOOD)
                    .status(BookCopy.CopyStatus.AVAILABLE)
                    .build();
                copies.add(copy);
            }
            bookCopyRepository.saveAll(copies);
        }
        log.info("✅ Đã tạo bản sao sách cho tất cả các đầu sách");
    }

    private void initBorrowRecords() {
        if (borrowRecordRepository.count() > 0) {
            return;
        }

        List<User> students = userRepository.findAll().stream()
            .filter(u -> u.getRole().getName() == Role.RoleName.STUDENT)
            .toList();

        List<BookCopy> availableCopies = bookCopyRepository.findAll().stream()
            .filter(c -> c.getStatus() == BookCopy.CopyStatus.AVAILABLE)
            .toList();

        if (students.isEmpty() || availableCopies.isEmpty()) {
            log.warn("⚠️  Không đủ dữ liệu để tạo bản ghi mượn trả");
            return;
        }

        LocalDate today = LocalDate.now();

        // Tạo một số bản ghi mượn đang mượn (BORROWED)
        for (int i = 0; i < 5 && i < availableCopies.size(); i++) {
            User student = students.get(random.nextInt(students.size()));
            BookCopy copy = availableCopies.get(i);

            // Ngày mượn từ 5-15 ngày trước
            LocalDate borrowDate = today.minusDays(random.nextInt(11) + 5);
            // Hạn trả từ 7-14 ngày sau ngày mượn
            LocalDate dueDate = borrowDate.plusDays(random.nextInt(8) + 7);

            BorrowRecord record = BorrowRecord.builder()
                .user(student)
                .bookCopy(copy)
                .borrowDate(borrowDate)
                .dueDate(dueDate)
                .status(BorrowRecord.BorrowStatus.BORROWED)
                .notes("Mượn để học tập")
                .build();
            borrowRecordRepository.save(record);

            // Cập nhật trạng thái book copy
            copy.setStatus(BookCopy.CopyStatus.BORROWED);
            bookCopyRepository.save(copy);
        }

        // Tạo một số bản ghi đã trả (RETURNED)
        for (int i = 0; i < 3 && i < availableCopies.size(); i++) {
            User student = students.get(random.nextInt(students.size()));
            BookCopy copy = availableCopies.get(5 + i);

            LocalDate borrowDate = today.minusDays(random.nextInt(30) + 15);
            LocalDate dueDate = borrowDate.plusDays(14);
            LocalDate returnDate = borrowDate.plusDays(random.nextInt(10) + 7); // Trả sớm hoặc đúng hạn

            BorrowRecord record = BorrowRecord.builder()
                .user(student)
                .bookCopy(copy)
                .borrowDate(borrowDate)
                .dueDate(dueDate)
                .returnDate(returnDate)
                .status(BorrowRecord.BorrowStatus.RETURNED)
                .notes("Trả đúng hạn")
                .build();
            borrowRecordRepository.save(record);

            copy.setStatus(BookCopy.CopyStatus.AVAILABLE);
            bookCopyRepository.save(copy);
        }

        // Tạo một số bản ghi quá hạn (OVERDUE)
        for (int i = 0; i < 2 && i < availableCopies.size(); i++) {
            User student = students.get(random.nextInt(students.size()));
            BookCopy copy = availableCopies.get(8 + i);

            LocalDate borrowDate = today.minusDays(random.nextInt(10) + 20);
            LocalDate dueDate = borrowDate.plusDays(14); // Đã quá hạn

            BorrowRecord record = BorrowRecord.builder()
                .user(student)
                .bookCopy(copy)
                .borrowDate(borrowDate)
                .dueDate(dueDate)
                .status(BorrowRecord.BorrowStatus.OVERDUE)
                .notes("Chưa trả - quá hạn")
                .build();
            borrowRecordRepository.save(record);

            copy.setStatus(BookCopy.CopyStatus.BORROWED);
            bookCopyRepository.save(copy);
        }

        log.info("✅ Đã tạo bản ghi mượn trả (5 đang mượn, 3 đã trả, 2 quá hạn)");
    }
}
