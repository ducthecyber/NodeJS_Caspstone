/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `BinhLuan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_phong` int DEFAULT NULL,
  `ma_nguoi_binh_luan` int DEFAULT NULL,
  `ngay_binh_luan` datetime DEFAULT NULL,
  `noi_dung` varchar(255) DEFAULT NULL,
  `sao_binh_luan` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ma_phong` (`ma_phong`),
  KEY `ma_nguoi_binh_luan` (`ma_nguoi_binh_luan`),
  CONSTRAINT `BinhLuan_ibfk_1` FOREIGN KEY (`ma_phong`) REFERENCES `Phong` (`id`),
  CONSTRAINT `BinhLuan_ibfk_2` FOREIGN KEY (`ma_nguoi_binh_luan`) REFERENCES `NguoiDung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `DatPhong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_phong` int DEFAULT NULL,
  `ngay_den` datetime DEFAULT NULL,
  `ngay_di` datetime DEFAULT NULL,
  `so_luong_khach` int DEFAULT NULL,
  `ma_nguoi_dat` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ma_phong` (`ma_phong`),
  KEY `ma_nguoi_dat` (`ma_nguoi_dat`),
  CONSTRAINT `DatPhong_ibfk_1` FOREIGN KEY (`ma_phong`) REFERENCES `Phong` (`id`),
  CONSTRAINT `DatPhong_ibfk_2` FOREIGN KEY (`ma_nguoi_dat`) REFERENCES `NguoiDung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `NguoiDung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pass_word` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `birth_day` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Phong` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_phong` varchar(255) DEFAULT NULL,
  `khach` int DEFAULT NULL,
  `phong_ngu` int DEFAULT NULL,
  `giuong` int DEFAULT NULL,
  `phong_tam` int DEFAULT NULL,
  `mo_ta` varchar(255) DEFAULT NULL,
  `gia_tien` int DEFAULT NULL,
  `may_giat` tinyint(1) DEFAULT NULL,
  `ban_la` tinyint(1) DEFAULT NULL,
  `tivi` tinyint(1) DEFAULT NULL,
  `dieu_hoa` tinyint(1) DEFAULT NULL,
  `wifi` tinyint(1) DEFAULT NULL,
  `bep` tinyint(1) DEFAULT NULL,
  `do_xe` tinyint(1) DEFAULT NULL,
  `ho_boi` tinyint(1) DEFAULT NULL,
  `ban_ui` tinyint(1) DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `ma_vi_tri` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ma_vi_tri` (`ma_vi_tri`),
  CONSTRAINT `Phong_ibfk_1` FOREIGN KEY (`ma_vi_tri`) REFERENCES `ViTri` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ViTri` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ten_vi_tri` varchar(255) DEFAULT NULL,
  `tinh_thanh` varchar(255) DEFAULT NULL,
  `quoc_gia` varchar(255) DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `BinhLuan` (`id`, `ma_phong`, `ma_nguoi_binh_luan`, `ngay_binh_luan`, `noi_dung`, `sao_binh_luan`) VALUES
(1, 27, 1, '2023-12-12 00:00:00', 'Lovely, cozy, convenient', 9);
INSERT INTO `BinhLuan` (`id`, `ma_phong`, `ma_nguoi_binh_luan`, `ngay_binh_luan`, `noi_dung`, `sao_binh_luan`) VALUES
(2, 27, 1, '2023-09-12 00:00:00', 'Modern, Spacious, Clean', 8);
INSERT INTO `BinhLuan` (`id`, `ma_phong`, `ma_nguoi_binh_luan`, `ngay_binh_luan`, `noi_dung`, `sao_binh_luan`) VALUES
(3, 28, 3, '2023-11-12 00:00:00', 'No Parking, Dark, Noisy', 3);
INSERT INTO `BinhLuan` (`id`, `ma_phong`, `ma_nguoi_binh_luan`, `ngay_binh_luan`, `noi_dung`, `sao_binh_luan`) VALUES
(4, 30, 4, '2023-07-07 00:00:00', 'Friednly host, good breakfast, beautiful view', 10),
(6, 32, 5, '2023-08-06 00:00:00', 'Expensive prices, quiet, adorable bedrom, large couch', 7),
(8, 30, 6, '2023-08-08 00:00:00', 'friendly, adorable, will come back', 10),
(9, 29, 9, '2023-09-09 00:00:00', 'nice breakfast, beautiful window view, large bed', 8),
(10, 27, 3, '2023-05-05 00:00:00', 'hot, dirty, noisy', 2),
(15, 33, 2, '2022-09-09 00:00:00', 'lovely host, interesting experience', 9),
(16, 30, 3, '2022-09-02 00:00:00', 'not a choice', 9),
(18, 28, 5, '2023-09-20 00:00:00', 'i love it very much', 5),
(19, 28, 6, '2023-10-20 00:00:00', 'i hate it so bady', 10),
(25, 27, 3, '2022-02-09 00:00:00', 'enthusiastic, lovely, kind', 10),
(26, 30, 6, '2023-10-10 00:00:00', 'will come back in future to enjoy wonderful tourist attractions', 8),
(103, 30, 6, '2023-10-10 00:00:00', 'will come back in future to enjoy wonderful tourist attractions', 8);

INSERT INTO `DatPhong` (`id`, `ma_phong`, `ngay_den`, `ngay_di`, `so_luong_khach`, `ma_nguoi_dat`) VALUES
(2, 27, '2022-09-07 00:00:00', '2022-09-20 00:00:00', 10, 1);
INSERT INTO `DatPhong` (`id`, `ma_phong`, `ngay_den`, `ngay_di`, `so_luong_khach`, `ma_nguoi_dat`) VALUES
(3, 27, '2022-10-07 00:00:00', '2022-10-20 00:00:00', 5, 2);
INSERT INTO `DatPhong` (`id`, `ma_phong`, `ngay_den`, `ngay_di`, `so_luong_khach`, `ma_nguoi_dat`) VALUES
(4, 28, '2022-11-07 00:00:00', '2022-11-20 00:00:00', 2, 3);
INSERT INTO `DatPhong` (`id`, `ma_phong`, `ngay_den`, `ngay_di`, `so_luong_khach`, `ma_nguoi_dat`) VALUES
(5, 29, '2022-12-07 00:00:00', '2022-12-20 00:00:00', 2, 4),
(6, 30, '2022-01-07 00:00:00', '2022-01-20 00:00:00', 7, 5),
(7, 31, '2022-01-07 00:00:00', '2022-01-20 00:00:00', 2, 3),
(8, 32, '2023-12-20 00:00:00', '2023-12-22 00:00:00', 13, 5),
(9, 32, '2023-12-20 00:00:00', '2023-12-22 00:00:00', 2, 5),
(10, 27, '2023-12-20 00:00:00', '2023-12-22 00:00:00', 6, 5),
(11, 30, '2022-09-08 00:00:00', '2022-10-10 00:00:00', 2, 9),
(16, 26, '2022-09-09 00:00:00', '2022-09-11 00:00:00', 0, 29),
(18, 28, '2022-10-10 00:00:00', '2023-10-10 00:00:00', 3, 29);

INSERT INTO `NguoiDung` (`id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`, `avatar`) VALUES
(1, 'michaelin', 'michaelin@gmail.com', 'and123', '0987333', '01/10/2003', 'male', 'AMDIN', NULL);
INSERT INTO `NguoiDung` (`id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`, `avatar`) VALUES
(2, 'Benjamin', 'benjamin@gmail.com', 'ben123', '0098763', '01-02-2020', 'male', 'user', '1673463340403-Daniel Craig.jpg');
INSERT INTO `NguoiDung` (`id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`, `avatar`) VALUES
(3, 'Charlie', 'charlie@gmail.com', 'cha123', '0098763', '01-12-2020', 'female', 'admin', NULL);
INSERT INTO `NguoiDung` (`id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`, `avatar`) VALUES
(4, 'Danny', 'danny@gmail.com', 'dan123', '0034763', '03-12-2020', 'male', 'admin', NULL),
(5, 'Emma', 'emma@gmail.com', 'emm123', '0114763', '07-12-2020', 'female', 'user', NULL),
(6, 'Flark', 'flark@gmail.com', 'fla123', '0034763', '03-02-2020', 'male', 'user', NULL),
(7, 'Guttanni', 'guttani@gmail.com', 'gut123', '0034273', '12-12-2020', 'female', 'admin', NULL),
(8, 'Henneiken', 'henneiken@gmail.com', 'hen123', '0011273', '12-07-2020', 'male', 'user', NULL),
(9, 'Kate', 'kate@gmail.com', 'kat123', '09878444', '1994-09-03', 'male', 'ADMIN', NULL),
(12, 'Sydney', 'sydney@gmail.com', 'syd1324', '09873344', '1994-09-03', 'female', 'ADMIN', NULL),
(13, 'Sydney1', 'sydney1@gmail.com', 'syd15324', '09873344', '1994-09-03', 'female', 'ADMIN', NULL),
(23, 'minh thư', 'mthu@gmail.com', 'thu1234', '09873833', '02/03/2003', 'female', 'USER', NULL),
(24, 'đức thế', 'the@gmail.com', 'the0987', '09878673', '02/01/2004', 'male', 'ADMIN', '1673610091955-daniel-craig-spectre-james-bond-16334936035081174811320.jpg'),
(25, 'roger halland', 'roger@gmail.com', 'roger333', '03883883', '12/03/1990', 'male', 'USER', NULL),
(26, 'custas', 'custas@gmail.com', 'custas134', '0987644', '02/03/2004', 'female', 'ADMIN', NULL),
(29, 'stardust', 'stardust@gmail.com', 'string111', '0987833', '02/03/2003', 'female', 'ADMIN', NULL),
(30, 'barack obama', 'barack@gmail.com', 'sbarack111', '098783333', '02/05/2003', 'male', 'ADMIN', NULL),
(31, 'barack obama', 'obama@gmail.com', 'sbarack111', '098783333', '02/05/2003', 'male', 'ADMIN', NULL),
(32, 'anthony', 'anthony@gmail.com', 'ant123', '09877733', '08/12/1990', 'male', 'USER', NULL),
(36, 'lionel messi', 'messi@gmail.com.vn', 'messi123', '09737783', '02/07/2000', 'male', 'USER', NULL),
(39, 'lionel messi 1', 'messilegend@gmail.com.vn', 'messi123', '09737783', '02/07/2000', 'male', 'USER', NULL),
(40, 'lionel messi 1', 'messiArgentina@gmail.com.vn', 'messi123', '09737783', '02/07/2000', 'male', 'USER', NULL),
(42, 'dareu', 'dareu@gmail.com', 'dare133', '083887373', '02/02/2009', 'male', 'USER', NULL);

INSERT INTO `Phong` (`id`, `ten_phong`, `khach`, `phong_ngu`, `giuong`, `phong_tam`, `mo_ta`, `gia_tien`, `may_giat`, `ban_la`, `tivi`, `dieu_hoa`, `wifi`, `bep`, `do_xe`, `ho_boi`, `ban_ui`, `hinh_anh`, `ma_vi_tri`) VALUES
(26, 'Panorama apartment', 4, 4, 4, 2, ' Peaceful, next to beautiful lake\r\nStudio fully equipped\r\nBalcony\r\nGreen & Fresh', 32, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'https://a0.muscache.com/im/pictures/miso/Hosting-770114124318740715/original/616fe970-c242-4fcd-bee8-533b6ea34ff6.jpeg?im_w=720', 1);
INSERT INTO `Phong` (`id`, `ten_phong`, `khach`, `phong_ngu`, `giuong`, `phong_tam`, `mo_ta`, `gia_tien`, `may_giat`, `ban_la`, `tivi`, `dieu_hoa`, `wifi`, `bep`, `do_xe`, `ho_boi`, `ban_ui`, `hinh_anh`, `ma_vi_tri`) VALUES
(27, 'Small apartment', 2, 2, 4, 2, 'Living close to nature, good food to eat, homemade wine to drink, lovely story to share, beautiful place to discover with local guide.', 20, 1, 1, 0, 1, 1, 0, 1, 1, 1, 'https://a0.muscache.com/im/pictures/miso/Hosting-12435854/original/d8d0b605-1610-4eee-931b-a4573e19caa8.jpeg?im_w=1200', 5);
INSERT INTO `Phong` (`id`, `ten_phong`, `khach`, `phong_ngu`, `giuong`, `phong_tam`, `mo_ta`, `gia_tien`, `may_giat`, `ban_la`, `tivi`, `dieu_hoa`, `wifi`, `bep`, `do_xe`, `ho_boi`, `ban_ui`, `hinh_anh`, `ma_vi_tri`) VALUES
(28, 'Street apartment', 2, 2, 4, 1, 'Lovely apartment located right in the heart of Hanoi, within walking distance to the most famous attractions', 18, 1, 1, 0, 1, 1, 0, 1, 1, 1, 'https://a0.muscache.com/im/pictures/miso/Hosting-680319079152503519/original/952f2a1c-7b0a-448e-aed7-915c176e7b49.jpeg?im_w=1200', 7);
INSERT INTO `Phong` (`id`, `ten_phong`, `khach`, `phong_ngu`, `giuong`, `phong_tam`, `mo_ta`, `gia_tien`, `may_giat`, `ban_la`, `tivi`, `dieu_hoa`, `wifi`, `bep`, `do_xe`, `ho_boi`, `ban_ui`, `hinh_anh`, `ma_vi_tri`) VALUES
(29, 'Modern apartment', 2, 2, 4, 1, 'Full modern furniture and equipment is provided. Large glass windows allow natural light to enter. ', 23, 0, 1, 1, 1, 1, 0, 0, 1, 1, '1673610194294-greece.jpg', 4),
(30, 'Veque Homflix', 2, 2, 4, 1, 'An incredible room for a tight budget, gorgeous decoration with 6-star hospitality', 46, 0, 1, 1, 1, 1, 0, 0, 1, 1, 'https://a0.muscache.com/im/pictures/miso/Hosting-732151647948523523/original/e9119eca-30cd-44c5-adc3-6aca78b130a9.png?im_w=1200', 1),
(31, 'Turtle Eco Luxe Villa', 2, 4, 4, 3, 'A unique Turtle Shape villa located in natural lotus pond surrounding by nature Khao Tao Valley  and Sai Noi beach. Private one bed room studio villa comprising spacious bathroom and outdoor waterside living deck.', 100, 0, 1, 1, 1, 1, 1, 1, 1, 1, 'https://a0.muscache.com/im/pictures/26229a9b-9c2c-4e36-bb6c-bf2ee22b1514.jpg?im_w=720', 6),
(32, 'Treehouse', 2, 2, 4, 3, 'Get away from the crowded tourist districts to the Northern mountains of Mae Taeng 90 mins from Chiang Mai', 200, 0, 1, 1, 1, 1, 1, 0, 1, 0, 'https://a0.muscache.com/im/pictures/5813338/7c1c4f7c_original.jpg?im_w=1200', 4),
(33, ' High Skyline Ocean View', 5, 5, 2, 3, 'STUNNING OCEAN VIEW ON 21st Floor\r\nA Romantic Place to get away with Special ones', 500, 0, 1, 1, 1, 1, 1, 0, 1, 0, 'https://a0.muscache.com/im/pictures/1f23e84a-f226-4b5d-9405-ffe291206b13.jpg?im_w=1200', 3),
(34, 'Panorama apartment', 2, 2, 2, 1, 'pretty nice', 20, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'https://a0.muscache.com/im/pictures/miso/Hosting-770114124318740715/original/616fe970-c242-4fcd-bee8-533b6ea34ff6.jpeg?im_w=720', 2),
(40, 'Sri Lankan Tropical Retreat', 6, 2, 2, 2, 'Guava House is a unique and remote jungle hideaway situated on a rubber tree plantation surrounded by mountains, paddy fields and the quiet sounds of the near by village away from mainstream tourist locations', 400, 1, 1, 1, 1, 1, 1, 1, 1, 1, '1673363399508-hometay-dalat-savingbooking-1.jpg', 6),
(44, ' High Skyline Mountain View', 5, 5, 2, 3, 'STUNNING OCEAN VIEW ON 21st Floor\r\nA Romantic Place to get away with Special ones', 500, 0, 1, 1, 1, 1, 1, 0, 1, 0, 'https:// a0.muscache.com/im/pictures/1f23e84a-f226-4b5d-9405-ffe291206b13.jpg?im_w=1200', 3),
(45, ' High Skyline Mountain View', 5, 5, 2, 3, 'This apartment is inside a modern building with shopping mall that include a modern supermarket and is just 2 minutes walk to beach, cinemas, pubs, night market, 5-star hotels such as I ntercontinental, Sheraton, Sunrise,..', 500, 0, 1, 1, 1, 1, 1, 0, 1, 0, 'https://a0.muscache.com/im/pictures/miso/Hosting-551233403054960877/original/ddc286d5-8f1c-4bc5-984b-4f77cd271191.jpeg?im_w=1200', 3),
(46, ' Căn hộ trung tâm tầng cao', 5, 5, 2, 3, 'This apartment is inside a modern building with shopping mall that include a modern supermarket and is just 2 minutes walk to beach, cinemas, pubs, night market, 5-star hotels such as I ntercontinental, Sheraton, Sunrise,.. ', 500, 0, 1, 1, 1, 1, 1, 0, 1, 0, 'https://a0.muscache.com/im/pictures/miso/Hosting-551233403054960877/original/ddc286d5-8f1c-4bc5-984b-4f77cd271191.jpeg?im_w=1200', 3),
(47, ' Nhà biển Hội An', 5, 5, 2, 3, 'Biệt thự bãi biển Jack Tran tọa lạc ngay trước bãi biển tại làng chài Bích Hòa Art Village- Bãi biển Tam Thanh, thành phố Tam Kỳ 45 phút lái xe đến phố cổ Hoàn Kiếm. ', 500, 0, 1, 1, 1, 1, 1, 0, 1, 0, 'https://a0.muscache.com/im/pictures/849d970a-1eb8-402e-8656-6dd8cd14d019.jpg?im_w=1200', 4);

INSERT INTO `ViTri` (`id`, `ten_vi_tri`, `tinh_thanh`, `quoc_gia`, `hinh_anh`) VALUES
(1, 'Ho Chi Minh city', 'Nam Bo province', 'Việt Nam', '1673519273017-b87e3ec0-56b4-4b46-9765-6990346b5520.webp');
INSERT INTO `ViTri` (`id`, `ten_vi_tri`, `tinh_thanh`, `quoc_gia`, `hinh_anh`) VALUES
(2, 'Da Lat', 'Lam Dong', 'Việt Nam', '1673591877683-dalattrongtoi.jpg');
INSERT INTO `ViTri` (`id`, `ten_vi_tri`, `tinh_thanh`, `quoc_gia`, `hinh_anh`) VALUES
(3, 'VungTau', 'Nam Bo', 'Viet Nam', 'https://a0.muscache.com/im/pictures/miso/Hosting-545989934801304825/original/1f7019ab-e4b5-4bb7-85b8-ce244326b53c.jpeg?im_w=1200');
INSERT INTO `ViTri` (`id`, `ten_vi_tri`, `tinh_thanh`, `quoc_gia`, `hinh_anh`) VALUES
(4, 'Phu Yen', 'Trung Bo', 'Viet Nam', 'https://a0.muscache.com/im/pictures/e08a218a-f1ff-427f-bc6c-6ce25e485ef5.jpg?im_w=1200'),
(5, 'Kon Tum', 'Tay Nguyen', 'Viet Nam', 'https://a0.muscache.com/im/pictures/dc2b4252-c317-405b-9511-06f2eec29a57.jpg?im_w=720'),
(6, 'Gia Lai', 'Tay Nguyen', 'Viet Nam', 'https://a0.muscache.com/im/pictures/ff2093ab-0017-47ca-99a8-6a499b23c30e.jpg?im_w=720'),
(7, 'Ha Giang', 'Tay Bac', 'Viet Nam', 'https://a0.muscache.com/im/pictures/37e36334-55f1-454e-84be-16b7c885102c.jpg?im_w=720'),
(8, 'Ha Noi', 'Bac Bo', 'Viet Nam', 'https://a0.muscache.com/im/pictures/miso/Hosting-770114124318740715/original/bcf11488-b3b9-4b51-9796-b72e4eca7f73.jpeg?im_w=720'),
(9, 'Koh Chang Tai', 'Trat', 'Thailand', 'https://a0.muscache.com/im/pictures/6e828160-265b-494e-a78c-95ffabe2b1af.jpg?im_w=1200'),
(10, 'Georgian Lake Mansion', 'Coventry', 'United Kingdom', 'https://a0.muscache.com/im/pictures/miso/Hosting-5845404/original/d7e3c7d2-1277-4117-94be-5d24144dbd9d.jpeg?im_w=1200'),
(11, 'Long Hải', 'Nam Bo', 'Viet Nam', 'https://a0.muscache.com/im/pictures/miso/Hosting-794040899210982221/original/e248af92-1308-4917-9481-a10c3712b4dc.jpeg?im_w=720'),
(12, 'Yoshino-gun', 'Nara-ken', 'Japan', 'https://a0.muscache.com/im/pictures/fb5b4cd4-f08a-4cdb-9955-ce34d92852ad.jpg?im_w=1440'),
(13, 'Yangpyeong-gun', 'Gyeonggi Province', 'Korea', 'https://a0.muscache.com/im/pictures/6a0e452b-f160-41b3-a2e9-3256e44117ac.jpg?im_w=1440'),
(14, 'Banff', 'Alberta', 'Canada', 'https://a0.muscache.com/im/pictures/17cc231c-5344-4873-8b76-c8d049633034.jpg?im_w=1200'),
(15, 'Chiang Mai', 'Northern Thailand', 'Thailand', 'https://a0.muscache.com/im/pictures/miso/Hosting-770114124318740715/original/bcf11488-b3b9-4b51-9796-b72e4eca7f73.jpeg?im_w=720'),
(16, 'Toronto', 'Ontario', 'Canada', 'https://a0.muscache.com/im/pictures/21e07620-05b9-48de-abd8-17c3a3281301.jpg?im_w=1200'),
(17, 'Taipei', 'Ontario', 'Taiwan', 'https://a0.muscache.com/im/pictures/c33a15a2-edf0-4567-af33-b7bf04ec58ae.jpg?im_w=1200'),
(18, 'Söråker', 'Västernorrlands län', 'Sweden', 'https://a0.muscache.com/im/pictures/b8212870-ce0c-435a-a415-e19e36e865c2.jpg?im_w=1200'),
(19, 'Mikkeli', 'Eastern Findland', 'Findland', 'https://a0.muscache.com/im/pictures/58680818/1225053c_original.jpg?im_w=1200'),
(20, 'Itea', 'Southeastern ', 'Greece', 'https://a0.muscache.com/im/pictures/74505fba-8a4f-40c1-8ba6-04446a2ccf24.jpg?im_w=1200');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;