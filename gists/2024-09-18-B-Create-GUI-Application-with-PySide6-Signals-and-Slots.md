1. **`basic/signals_and_slots_1.py`**

```python
from __future__ import annotations

import sys

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(
        self,
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press Me!")
        button.setCheckable(True)
        button.clicked.connect(self.button_was_clicked)

        self.setCentralWidget(button)

    def button_was_clicked(self) -> None:
        print("clicked")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/signals_and_slots_1b.py`**

```python
from __future__ import annotations

import sys

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(
        self,
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press Me!")
        button.setCheckable(True)
        button.clicked.connect(self.button_was_clicked)
        button.clicked.connect(self.button_was_toggled)
        button.toggled.connect(self.button_was_toggled)

        self.setCentralWidget(button)

    def button_was_clicked(self) -> None:
        print("clicked")

    def button_was_toggled(self, checked: bool) -> None:
        print("toggled", checked)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/signals_and_slots_1c.py`**

```python
from __future__ import annotations

import sys

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(
        self,
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)

        self.button_is_checked = True

        self.setWindowTitle("My App")

        button = QPushButton("Press Me!")
        button.setCheckable(True)
        button.clicked.connect(self.button_was_toggled)
        button.setChecked(self.button_is_checked)

        self.setCentralWidget(button)

    def button_was_toggled(self, checked: bool) -> None:
        print("toggled", checked)
        self.button_is_checked = checked


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/signals_and_slots_1d.py`**

```python
from __future__ import annotations

import sys

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(
        self,
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)

        self.button_is_checked = True

        self.setWindowTitle("My App")

        self.button = QPushButton("Press Me!")
        self.button.setCheckable(True)
        self.button.clicked.connect(self.button_was_checked)
        self.button.setChecked(self.button_is_checked)

        self.setCentralWidget(self.button)

    def button_was_checked(self) -> None:
        self.button_is_checked = self.button.isChecked()
        print(self.button_is_checked)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/signals_and_slots_2.py`**

```python
from __future__ import annotations

import sys

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(
        self,
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        self.button = QPushButton("Press Me!")
        self.button.clicked.connect(self.button_was_clicked)
        self.setCentralWidget(self.button)

    def button_was_clicked(self) -> None:
        self.button.setText("You already clicked me.")
        self.setEnabled(False)
        self.setWindowTitle("My Oneshot App")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```


1. **`basic/signals_and_slots_3.py`**

```python
from __future__ import annotations

import sys
from random import choice
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QWidget,
)

window_titles = [
    "My App",
    "My App",
    "Still My App",
    "Still My App",
    "What on earth",
    "What on earth",
    "This is surprising",
    "This is surprising",
    "Something went wrong",
]


class MainWindow(QMainWindow):
    def __init__(
        self: Self,
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)
        self.setWindowTitle("My App")

        self.n_times_clicked = 0

        self.button = QPushButton("Press Me!")
        self.button.clicked.connect(self.button_was_clicked)
        self.windowTitleChanged.connect(self.window_title_changed)

        self.setCentralWidget(self.button)

    def button_was_clicked(self: Self) -> None:
        print("Clicked.")
        new_window_title = choice(window_titles)

        print(f"Setting title: {new_window_title}")
        self.setWindowTitle(new_window_title)

    def window_title_changed(self: Self, window_title: str) -> None:
        print(f"Window title changed: {window_title}")

        if window_title == "Something went wrong":
            self.button.setDisabled(True)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/signals_and_slots_4.py`**

```python
from __future__ import annotations

import sys
from random import choice
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QLineEdit,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(
        self: Self,
        parent: QWidget | None = None,
    ) -> None:
        super().__init__(parent)
        self.setWindowTitle("My App")

        self.label = QLabel()
        self.input = QLineEdit()
        self.input.textChanged.connect(self.label.setText)

        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.input)

        container = QWidget()
        container.setLayout(layout)

        self.setCentralWidget(container)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_1.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QApplication, QLabel, QMainWindow, QWidget


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QLabel("Hello")

        font = widget.font()
        font.setPointSize(30)

        widget.setFont(font)
        widget.setAlignment(Qt.AlignHCenter | Qt.AlignVCenter)

        self.setCentralWidget(widget)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_2a.py`**

```python
from __future__ import annotations

from genericpath import exists
import sys
from typing import Self
from pathlib import Path

from PySide6.QtCore import QSize, Qt
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QApplication, QLabel, QMainWindow, QWidget


CURRENT_PATH = Path(__file__).parent.resolve()


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QLabel("Hello")

        image_path = CURRENT_PATH / "pilars-of-creation.jpg"
        pixmap = QPixmap(image_path)

        if pixmap.isNull():
            widget.setText("Failed to load image")

        else:
            # widget.setPixmap(pixmap)
            # self.resize(pixmap.size())

            target_size = QSize(400, 300)
            scaled_pixmap = pixmap.scaled(
                target_size,
                Qt.AspectRatioMode.KeepAspectRatio,
                Qt.TransformationMode.SmoothTransformation,
            )

            widget.setPixmap(scaled_pixmap)
            self.resize(scaled_pixmap.size())

        widget.setAlignment(
            Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter
        )

        self.setCentralWidget(widget)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_2b.py`**

```python
from __future__ import annotations

from genericpath import exists
import sys
from typing import Self
from pathlib import Path

from PySide6.QtCore import QSize, Qt
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QApplication, QLabel, QMainWindow, QWidget


CURRENT_PATH = Path(__file__).parent.resolve()


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QLabel("Hello")

        image_path = CURRENT_PATH / "pilars-of-creation.jpg"
        pixmap = QPixmap(image_path)
        widget.setScaledContents(True)

        if pixmap.isNull():
            widget.setText("Failed to load image")

        else:
            # widget.setPixmap(pixmap)
            # self.resize(pixmap.size())

            target_size = QSize(400, 300)
            scaled_pixmap = pixmap.scaled(
                target_size,
                Qt.AspectRatioMode.KeepAspectRatio,
                Qt.TransformationMode.SmoothTransformation,
            )

            widget.setPixmap(scaled_pixmap)
            self.resize(scaled_pixmap.size())

        widget.setAlignment(
            Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter
        )

        self.setCentralWidget(widget)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```