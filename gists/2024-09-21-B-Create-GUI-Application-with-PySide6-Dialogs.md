1. **`basic/dialogs_1.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QDialog,
    QMainWindow,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press me for a dialog")
        button.clicked.connect(self.button_clicked)

        self.setCentralWidget(button)

    def button_clicked(self: Self, s: bool) -> None:
        print("clicked", s)

        dialog = QDialog(self)
        dialog.setWindowTitle("?")
        dialog.exec()


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/dialogs_2a.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QDialog,
    QDialogButtonBox,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class CustomDialog(QDialog):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("Hello!")

        buttons = QDialogButtonBox.Ok | QDialogButtonBox.Cancel
        self.buttonBox = QDialogButtonBox(buttons)
        self.buttonBox.accepted.connect(self.accept)
        self.buttonBox.rejected.connect(self.reject)

        self.layout = QVBoxLayout()
        message = QLabel("Something happened, is that OK?")
        self.layout.addWidget(message)
        self.layout.addWidget(self.buttonBox)
        self.setLayout(self.layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press me for a dialog")
        button.clicked.connect(self.button_clicked)

        self.setCentralWidget(button)

    def button_clicked(self: Self, s: bool) -> None:
        print("clicked", s)

        dialog = CustomDialog()
        dialog.setWindowTitle("?")

        if dialog.exec():
            print("Success!")
        else:
            print("Cancel!")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/dialogs_2b.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QDialog,
    QDialogButtonBox,
    QLabel,
    QMainWindow,
    QPushButton,
    QVBoxLayout,
    QWidget,
)


class CustomDialog(QDialog):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("Hello!")

        buttons = QDialogButtonBox.Ok | QDialogButtonBox.Cancel
        self.buttonBox = QDialogButtonBox(buttons)
        self.buttonBox.accepted.connect(self.accept)
        self.buttonBox.rejected.connect(self.reject)

        self.layout = QVBoxLayout()
        message = QLabel("Something happened, is that OK?")
        self.layout.addWidget(message)
        self.layout.addWidget(self.buttonBox)
        self.setLayout(self.layout)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press me for a dialog")
        button.clicked.connect(self.button_clicked)

        self.setCentralWidget(button)

    def button_clicked(self: Self, s: bool) -> None:
        print("clicked", s)

        dialog = CustomDialog(self)
        dialog.setWindowTitle("?")

        if dialog.exec():
            print("Success!")
        else:
            print("Cancel!")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/dialogs_3.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press me for a dialog")
        button.clicked.connect(self.button_clicked)

        self.setCentralWidget(button)

    def button_clicked(self: Self, s: bool) -> None:
        print("clicked", s)

        dlg = QMessageBox(self)
        dlg.setWindowTitle("I have a question!")
        dlg.setText("This is a simple dialog")
        button = dlg.exec()

        if button == QMessageBox.Ok:
            print("OK!")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/widgets_7.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QSpinBox,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        widget = QSpinBox()
        widget.setMinimum(-10)
        widget.setMaximum(3)

        widget.setPrefix("$")
        widget.setSuffix("c")
        widget.setSingleStep(3)

        widget.valueChanged.connect(self.value_changed)
        widget.textChanged.connect(self.value_changed_str)
        self.setCentralWidget(widget)

    def value_changed(self: Self, i: int) -> None:
        print(i)

    def value_changed_str(self: Self, s: str) -> None:
        print(s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/dialogs_4.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press me for a dialog")
        button.clicked.connect(self.button_clicked)

        self.setCentralWidget(button)

    def button_clicked(self: Self, s: bool) -> None:
        print("clicked", s)

        dlg = QMessageBox(self)
        dlg.setWindowTitle("I have a question!")
        dlg.setText("This is a simple dialog")
        dlg.setStandardButtons(QMessageBox.Yes | QMessageBox.Ok)
        dlg.setIcon(QMessageBox.Question)
        button = dlg.exec()

        if button == QMessageBox.Yes:
            print("OK!")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/dialogs_5.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press me for a dialog")
        button.clicked.connect(self.button_clicked)

        self.setCentralWidget(button)

    def button_clicked(self: Self, s: bool) -> None:
        print("clicked", s)

        button = QMessageBox.question(
            self,
            "Question dialog",
            "The  longer message",
        )

        if button == QMessageBox.Yes:
            print("Yes")
        else:
            print("No")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/dialogs_6.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press me for a dialog")
        button.clicked.connect(self.button_clicked)

        self.setCentralWidget(button)

    def button_clicked(self: Self, s: bool) -> None:
        print("clicked", s)

        button = QMessageBox.critical(
            self,
            "Oh Dear!",
            "Something went terrible wrong.",
            buttons=QMessageBox.Discard
            | QMessageBox.NoToAll
            | QMessageBox.Ignore,
            defaultButton=QMessageBox.Discard,
        )

        if button == QMessageBox.Discard:
            print("Discard")
        elif button == QMessageBox.NoToAll:
            print("No to all!")
        else:
            print("Ignore")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/dialogs_start.py`**

```python
from __future__ import annotations

import sys
from typing import Self

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QPushButton,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self: Self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

        self.setWindowTitle("My App")

        button = QPushButton("Press me for a dialog")
        button.clicked.connect(self.button_clicked)

        self.setCentralWidget(button)

    def button_clicked(self: Self, s: bool) -> None:
        print("clicked", s)


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```