export default function Vokabel({vokabel}) {

    return (
        <div>
            <div>
                <label htmlFor="deutsch">Deutsch</label>
                <input id="deutsch" value={vokabel.Deutsch} />
            </div>
            <div>
                <label htmlFor="englisch">Englisch</label>
                <input id="englisch" value={vokabel.Englisch} />
            </div>

        </div>
    )
}