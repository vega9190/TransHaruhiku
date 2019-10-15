using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace TransHaruhiko.Models.ViewModel
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "El campo Usuario es obligatorio."), AllowHtml]
        public string Usuario { get; set; }

        [Required(ErrorMessage = "El campo Contraseña es obligatorio.")]
        [AllowHtml]
        [DataType(DataType.Password)]
        public string Contraseña { get; set; }
    }
}