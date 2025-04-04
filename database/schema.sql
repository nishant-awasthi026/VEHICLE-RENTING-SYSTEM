CREATE DATABASE vehicle_renting;

USE vehicle_renting;

CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE,
    Password VARCHAR(255),
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(20),
    Role ENUM('Owner', 'Renter')
);

CREATE TABLE Vehicles (
    VehicleID INT AUTO_INCREMENT PRIMARY KEY,
    OwnerID INT,
    Make VARCHAR(50),
    Model VARCHAR(50),
    Year INT,
    Type VARCHAR(20),
    LicensePlate VARCHAR(20) UNIQUE,
    Description TEXT,
    PricePerDay DECIMAL(10,2),
    IsListed BOOLEAN,
    Location VARCHAR(100),
    FOREIGN KEY (OwnerID) REFERENCES Users(UserID)
);

CREATE TABLE Bookings (
    BookingID INT AUTO_INCREMENT PRIMARY KEY,
    VehicleID INT,
    RenterID INT,
    StartDate DATE,
    EndDate DATE,
    TotalPrice DECIMAL(10,2),
    Status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
    FOREIGN KEY (VehicleID) REFERENCES Vehicles(VehicleID),
    FOREIGN KEY (RenterID) REFERENCES Users(UserID),
    CHECK (StartDate < EndDate)
);

DELIMITER //
CREATE TRIGGER check_booking_overlap
BEFORE INSERT ON Bookings
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Confirmed' AND EXISTS (
        SELECT 1 FROM Bookings
        WHERE VehicleID = NEW.VehicleID
        AND Status = 'Confirmed'
        AND StartDate < NEW.EndDate
        AND EndDate > NEW.StartDate
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Booking dates overlap with an existing confirmed booking';
    END IF;
END;
//
DELIMITER ;