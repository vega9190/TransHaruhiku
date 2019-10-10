using System.Collections.Generic;
using System.Linq;

namespace TransHaruhiku.Models.TransferStruct
{
    public class BaseResult
    {
        public List<string> Errors { get; set; }
        public bool HasErrors => Errors.Any();
        public List<string> Warnings { get; set; }
        public bool HasWarnings => Warnings.Any();
        public List<string> Messages { get; set; }
        public bool HasMessages => Messages.Any();
        public BaseResult()
        {
            Errors = new List<string>();
            Warnings = new List<string>();
            Messages = new List<string>();
        }
    }
}